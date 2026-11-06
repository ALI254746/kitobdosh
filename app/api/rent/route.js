import { publicRecord } from "@/lib/server-auth";
import Book from '@/model/Book';
import Asset from '@/model/UploadAsset';
import { v2 as cloudinary } from 'cloudinary';
import { authorize } from '@/lib/server-auth';
import { createOrder } from '@/lib/create-order';
import { prepareOrder, OrderInputError } from '@/lib/order-input.mjs';
import { coordinates } from '@/lib/checkout-pricing.mjs';
import { isObjectId } from '@/lib/catalog-input.mjs';
import { uploadImage, configureCloudinary, UploadInputError } from '@/lib/uploads';
import { clearCache } from '@/lib/utils/cache';
import { requireRole } from "@/lib/require-role";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import Notification from "@/model/Notification";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  const access = await authorize(); if (access.response) return access.response;
  let document;
  try {
    await dbConnect();
    const form = await req.formData();
    const payload = { customer: { name: form.get('name'), phone: form.get('phone'), address: form.get('address'), ...coordinates(form.get('lat'), form.get('lng')) }, items: [{ book: form.get('bookId'), type: 'rent', quantity: 1, rentDays: Number(form.get('days')) }], deliveryMethod: 'pickup', paymentMethod: form.get('payment') || 'cash' };
    if (!isObjectId(payload.items[0].book)) return NextResponse.json({ success: false }, { status: 400 });
    prepareOrder(payload, await Book.find({ _id: payload.items[0].book }).lean());
    document = await uploadImage(form.get('passport'), access.user.id, 'kitobdosh/passports', true);
    const order = await createOrder(payload, access.user.id, document);
    const rent = await Rent.findOne({ orderId: order._id }).select('-passportUrl -passportCloudinaryId -passportFormat');
    await clearCache(`profile_full:${access.user.id}`);
    return NextResponse.json({ success: true, message: 'Ijara so‘rovi qabul qilindi. To‘lov kutilmoqda.', data: rent });
  } catch (error) {
    if (document) { try { configureCloudinary(); await cloudinary.uploader.destroy(document.publicId, { type: 'authenticated' }); await Asset.deleteOne({ publicId: document.publicId, owner: access.user.id }); } catch {} }
    return NextResponse.json({ success: false, message: 'Ijara ma’lumotlari yoki hujjat rasmi noto‘g‘ri' }, { status: error instanceof OrderInputError || error instanceof UploadInputError || error.name === 'ValidationError' || error.message === 'Koordinatalar noto‘g‘ri' ? 400 : 503 });
  }
}

export async function PUT(req) {
  const denied = await requireRole();
  if (denied) return denied;
    try {
        await dbConnect();
        const { id, status } = await req.json();

        if (!isObjectId(id) || !['pending', 'approved', 'rejected', 'returned', 'late', 'active', 'return_requested'].includes(status)) {
            return NextResponse.json({ success: false, message: "Ma'lumotlar yetarli emas" }, { status: 400 });
        }

        const updateFull = { status };
        if (status === 'approved') {
            const rent = await Rent.findById(id);
            if (rent) {
                const returnDate = new Date();
                returnDate.setDate(returnDate.getDate() + (rent.days || 1));
                updateFull.returnDate = returnDate;
            }
            updateFull.courierStatus = 'new';
            console.log(`Rent API: Request Approved. Setting courierStatus to 'new' and returnDate to ${updateFull.returnDate}. ID: ${id}`);
        }
        console.log(`Rent API: Updating Rent ${id} status to ${status}`);
        const updatedRent = await Rent.findByIdAndUpdate(id, updateFull, { new: true, runValidators: true });
        
        if (!updatedRent) {
             return NextResponse.json({ success: false, message: "Topilmadi" }, { status: 404 });
        }

        // Notification Logic
        if (updatedRent.user && (status === 'approved' || status === 'rejected' || status === 'returned')) {
             let title = "Ijara So'rovi Yangilandi";
             let message = "";
             let type = "info";

             if (status === 'approved') {
                 title = "Ijara So'rovi Tasdiqlandi! ✅";
                 message = `Sizning "${updatedRent.bookTitle}" kitobi uchun ijara so'rovingiz tasdiqlandi. Tez orada aloqaga chiqamiz.`;
                 type = "success";
             } else if (status === 'rejected') {
                 title = "Ijara So'rovi Rad Etildi ❌";
                 message = `Sizning "${updatedRent.bookTitle}" kitobi uchun ijara so'rovingiz rad etildi.`;
                 type = "error";
             } else if (status === 'returned') {
                 title = "Kitob Qaytarildi 📚";
                 message = `"${updatedRent.bookTitle}" kitobi muvaffaqiyatli qaytarildi. Xizmatimizdan foydalanganingiz uchun rahmat!`;
                 type = "success";
             }

             await Notification.create({
                 user: updatedRent.user,
                 title,
                 message,
                 type
             });
        }

        if (updatedRent.user) await clearCache(`profile_full:${updatedRent.user}`);
        return NextResponse.json({ success: true, data: publicRecord(updatedRent) });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET() {
  const denied = await requireRole();
  if (denied) return denied;
  try {
     await dbConnect();
     const rentals = await Rent.find().select('-passportUrl -passportCloudinaryId -passportAssetId').sort({ createdAt: -1 });
     return NextResponse.json({ success: true, data: publicRecord(rentals) });
  } catch (error) {
     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
