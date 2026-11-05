import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { dbConnect } from '@/lib/db.Connect';
import Order from '@/model/Order';
import Rent from '@/model/Rent';
import { isObjectId } from '@/lib/catalog-input.mjs';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Avval tizimga kiring' }, { status: 401 });
    const { orderId } = await req.json();
    if (!isObjectId(orderId)) return NextResponse.json({ error: 'Buyurtma ID noto‘g‘ri' }, { status: 400 });
    if (!process.env.PAYME_MERCHANT_ID) return NextResponse.json({ error: 'Onlayn to‘lov hozircha sozlanmagan' }, { status: 503 });
    await dbConnect();
    const order = await Order.findOne({ _id: orderId, user: session.user.id }) || await Rent.findOne({ _id: orderId, user: session.user.id });
    if (!order) return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    if (order.paymentStatus === 'paid' || order.status === 'cancelled') return NextResponse.json({ error: 'Buyurtma to‘lov uchun mavjud emas' }, { status: 409 });
    const amount = Math.round(order.totalPrice * 100);
    const params = `m=${process.env.PAYME_MERCHANT_ID};ac.order_id=${orderId};a=${amount};l=uz`;
    const baseUrl = process.env.PAYME_MODE === 'production' ? 'https://checkout.paycom.uz' : 'https://test.paycom.uz';
    return NextResponse.json({ success: true, url: `${baseUrl}/${Buffer.from(params).toString('base64')}` });
  } catch {
    return NextResponse.json({ error: 'To‘lov havolasini tayyorlab bo‘lmadi' }, { status: 500 });
  }
}
