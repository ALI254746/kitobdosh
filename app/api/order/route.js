import { publicRecord } from "@/lib/server-auth";
import { authorize } from '@/lib/server-auth';
import { createOrder } from '@/lib/create-order';
import { uploadImage, configureCloudinary, UploadInputError } from '@/lib/uploads';
import { v2 as cloudinary } from 'cloudinary';
import Asset from '@/model/UploadAsset';
import { clearCache, clearCachePattern } from '@/lib/utils/cache';
import { requireRole } from "@/lib/require-role";
import Book from "@/model/Book";
import { prepareOrder, OrderInputError } from "@/lib/order-input.mjs";
import { isObjectId } from "@/lib/catalog-input.mjs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Order from "@/model/Order";
import Rent from "@/model/Rent";
import Notification from "@/model/Notification";
import { pusherServer } from "@/lib/pusher";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from 'mongoose';

export async function POST(req) {
  const access = await authorize(); if (access.response) return access.response;
  let document;
  try {
    await dbConnect();
    let payload;
    if ((req.headers.get('content-type') || '').includes('multipart/form-data')) {
      const form = await req.formData();
      payload = { customer: JSON.parse(form.get('customer') || '{}'), items: JSON.parse(form.get('items') || '[]'), deliveryMethod: form.get('deliveryMethod'), paymentMethod: form.get('paymentMethod') };
      // Validate before any external upload; private storage identifiers are server-owned.
      const books = await Book.find({ _id: { $in: (Array.isArray(payload.items) ? payload.items : []).filter(i => isObjectId(i.book)).map(i => i.book) } }).lean();
      prepareOrder(payload, books);
      if (payload.items.some(i => i.type === 'rent')) document = await uploadImage(form.get('passport'), access.user.id, 'kitobdosh/passports', true);
    } else payload = await req.json();
    const order = await createOrder(payload, access.user.id, document);
    await clearCache(`profile_full:${access.user.id}`);
    await clearCachePattern('books_*');
    return NextResponse.json({ success: true, message: 'Buyurtma qabul qilindi. To‘lov kutilmoqda.', data: order });
  } catch (error) {
    if (document) { try { configureCloudinary(); await cloudinary.uploader.destroy(document.publicId, { type: 'authenticated' }); await Asset.deleteOne({ publicId: document.publicId, owner: access.user.id }); } catch {} }
    const invalid = error instanceof OrderInputError || error instanceof UploadInputError || error instanceof SyntaxError || error.name === 'ValidationError';
    return NextResponse.json({ success: false, message: invalid ? 'Buyurtma maydonlari yoki hujjat rasmi noto‘g‘ri' : 'Buyurtmani saqlab bo‘lmadi. Qayta urinib ko‘ring.' }, { status: invalid ? 400 : 503 });
  }
}

export async function GET() {
  const denied = await requireRole();
  if (denied) return denied;
    try {
        await dbConnect();
        const orders = await Order.find().select('-passportUrl -passportCloudinaryId -passportAssetId').populate('user', 'email').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error("Order GET Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
  const denied = await requireRole();
  if (denied) return denied;
    try {
        await dbConnect();
        const { id, status } = await req.json();
        console.log(`Order PUT - Updating Order ${id} to ${status}`);

        if (!isObjectId(id) || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            return NextResponse.json({ success: false, message: "Ma'lumot kam" }, { status: 400 });
        }

        let updatedOrder;
        if (status === 'cancelled') {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    updatedOrder = await Order.findOneAndUpdate(
                        { _id: id, status: { $in: ['pending', 'processing'] } },
                        { $set: { status: 'cancelled' } },
                        { new: true, session }
                    );
                    if (!updatedOrder) return;
                    const quantities = new Map();
                    for (const item of updatedOrder.items || []) {
                        if (!item?.book || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
                        const key = String(item.book);
                        quantities.set(key, (quantities.get(key) || 0) + item.quantity);
                    }
                    for (const [book, quantity] of quantities) {
                        await Book.updateOne({ _id: book }, { $inc: { stock: quantity } }, { session });
                    }
                    await Rent.updateMany(
                        { orderId: updatedOrder._id, status: { $in: ['pending', 'approved', 'courier_assigned', 'courier_picked_up'] } },
                        { $set: { status: 'rejected' } },
                        { session }
                    );
                });
            } finally {
                await session.endSession();
            }
            if (!updatedOrder) {
                const existing = await Order.findById(id);
                if (!existing) return NextResponse.json({ success: false, message: "Buyurtma topilmadi" }, { status: 404 });
                if (existing.status === 'cancelled') return NextResponse.json({ success: true, data: publicRecord(existing) });
                return NextResponse.json({ success: false, message: "Yetkazilgan buyurtmani bekor qilib, zaxirani qaytarib bo‘lmaydi" }, { status: 409 });
            }
            await clearCachePattern('books_*');
        } else {
            const updateFull = { status };
            if (status === 'processing') {
                updateFull.courierStatus = 'new';
                console.log(`Order API: Order Processing. Setting courierStatus to 'new'. ID: ${id}`);
            }
            console.log(`Order API: Updating Order ${id} status to ${status}`);
            updatedOrder = await Order.findByIdAndUpdate(id, updateFull, { new: true, runValidators: true });
            if (!updatedOrder) {
                return NextResponse.json({ success: false, message: "Buyurtma topilmadi" }, { status: 404 });
            }
        }
        
        console.log("Order PUT - Updated Order UserID:", updatedOrder.user);

        if (updatedOrder.user && (status === 'completed' || status === 'cancelled' || status === 'processing')) {
             console.log("Order PUT - Creating Notification for User:", updatedOrder.user);
             
             let title = "Buyurtma Yangilanishi";
             let message = "";
             let type = "info";

             if (status === 'processing') {
                 title = "Buyurtma Tasdiqlandi! ✅";
                 message = `Sizning #${updatedOrder._id.toString().slice(-6)} raqamli buyurtmangiz tasdiqlandi. Kuryer tayinlanmoqda.`;
                 type = "success";

                 // START PUSHER COURIER TRIGGER
                 try {
                     await pusherServer.trigger("courier-channel", "new-job", {
                         message: "Yangi yetkazib berish (Buyurtma)!",
                         orderId: updatedOrder._id,
                         address: updatedOrder.customer.address,
                     });
                     console.log("Pusher Triggered: courier-channel/new-job");
                 } catch (pErr) {
                     console.error("Pusher Courier Error:", pErr);
                 }
                 // END PUSHER COURIER TRIGGER
             } else if (status === 'completed') {
                 title = "Buyurtma Yetkazildi! 🚀";
                 message = `Sizning #${updatedOrder._id.toString().slice(-6)} raqamli buyurtmangiz muvaffaqiyatli yetkazildi. Xaridingiz uchun rahmat!`;
                 type = "success";
             } else if (status === 'cancelled') {
                 title = "Buyurtma Bekor Qilindi ❌";
                 message = `Sizning #${updatedOrder._id.toString().slice(-6)} raqamli buyurtmangiz bekor qilindi.`;
                 type = "error";
             }

             const notif = await Notification.create({
                 user: updatedOrder.user,
                 title,
                 message,
                 type
             });
             console.log("Order PUT - Notification Created:", notif._id);
        } else {
             console.log("Order PUT - Skipping Notification (No User or Status mismatch)");
        }

        if (updatedOrder.user) await clearCache(`profile_full:${updatedOrder.user}`);
        return NextResponse.json({ success: true, data: publicRecord(updatedOrder) });
    } catch (error) {
        console.error("Order PUT Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


