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
  try {
    await dbConnect();
    
    let payload = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const customer = JSON.parse(formData.get("customer") || "{}");
        const items = JSON.parse(formData.get("items") || "[]");
        const passportFile = formData.get("passport");

        payload = {
            customer,
            items,
            deliveryMethod: formData.get("deliveryMethod"),
            paymentMethod: formData.get("paymentMethod"),
            totalPrice: Number(formData.get("totalPrice")),
        };

        // Handle Passport Upload to Cloudinary
        if (passportFile && passportFile.size > 0) {
            const { v2: cloudinary } = await import('cloudinary');
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const bytes = await passportFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'kitobdosh/passports',
                        resource_type: 'auto'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            payload.passportUrl = uploadResult.secure_url;
            payload.passportCloudinaryId = uploadResult.public_id;
        }
    } else {
        payload = await req.json();
    }

    // 1. Auth Check: Session
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    // 2. Fallback: Token
    if (!userId) {
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("kitobdosh_token")?.value;
            
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            }
        } catch (e) {
            console.error("DEBUG: Token error", e);
        }
    }

    if (!userId) {
         return NextResponse.json({ success: false, message: "Iltimos, avval tizimga kiring!" }, { status: 401 });
    }

    const finalOrderData = {
        ...payload,
        user: userId
    };

    const newOrder = new Order(finalOrderData);
    await newOrder.save();
    
    // 3. For RENTAL items: Create records in Rent collection for Admin Panel visibility
    const rentalItems = finalOrderData.items.filter(i => i.type === 'rent');
    if (rentalItems.length > 0) {
        for (const item of rentalItems) {
            try {
                await Rent.create({
                    user: userId,
                    book: item.book,
                    bookTitle: item.title,
                    bookImage: item.image || "", // Try to pass image in checkout or fetch later
                    fullName: finalOrderData.customer.name,
                    phone: finalOrderData.customer.phone,
                    address: finalOrderData.customer.address,
                    passportUrl: finalOrderData.passportUrl || "",
                    days: item.rentDays || 1,
                    totalPrice: item.price,
                    paymentMethod: finalOrderData.paymentMethod,
                    status: 'pending',
                    orderId: newOrder._id // Cross-reference
                });
            } catch (rentError) {
                console.error("Error creating Rent entry for order item:", rentError);
            }
        }
    }

    // Notify Admins
    try {
        await pusherServer.trigger("admin-channel", "new-order", {
            message: "Yangi buyurtma keldi!",
            orderId: newOrder._id,
            customer: newOrder.customer?.name || "Noma'lum",
            totalPrice: newOrder.totalPrice
        });
    } catch (pusherError) {
        console.error("Pusher Admin Trigger Error:", pusherError);
    }

    return NextResponse.json({ success: true, message: "Buyurtma qabul qilindi", data: newOrder });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, message: "Xatolik yuz berdi: " + error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find().populate('user', 'email').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error("Order GET Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, status } = await req.json();
        console.log(`Order PUT - Updating Order ${id} to ${status}`);

        if (!id || !status) {
            return NextResponse.json({ success: false, message: "Ma'lumot kam" }, { status: 400 });
        }

        const updateFull = { status };
        if (status === 'processing') {
            updateFull.courierStatus = 'new';
            console.log(`Order API: Order Processing. Setting courierStatus to 'new'. ID: ${id}`);
        }
        
        console.log(`Order API: Updating Order ${id} status to ${status}`);
        const updatedOrder = await Order.findByIdAndUpdate(id, updateFull, { new: true });

        if (!updatedOrder) {
             return NextResponse.json({ success: false, message: "Buyurtma topilmadi" }, { status: 404 });
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

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error("Order PUT Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


