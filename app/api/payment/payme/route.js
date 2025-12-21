import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { orderId, amount } = await req.json();

        if (!orderId || !amount) {
            return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 });
        }

        // Payme Merchant ID - .env.local faylidan olinadi, agar bo'lmasa test ID ishlatiladi
        const MERCHANT_ID = process.env.PAYME_MERCHANT_ID || "6764f69372ce606e309cc4cb"; 
        const IS_TEST = process.env.PAYME_MODE !== 'production';
        
        // Summani tiyinga aylantirish (1 so'm = 100 tiyin)
        const paymeAmount = amount * 100;

        // Base64 kodlash: m=MERCHANT_ID;ac.order_id=ORDER_ID;a=AMOUNT;l=uz
        const params = `m=${MERCHANT_ID};ac.order_id=${orderId};a=${paymeAmount};l=uz`;
        const encodedParams = typeof window === 'undefined' 
            ? Buffer.from(params).toString('base64') 
            : btoa(params);

        // Muhitga qarab URL tanlash
        const baseUrl = IS_TEST ? 'https://test.paycom.uz' : 'https://checkout.paycom.uz';
        const checkoutUrl = `${baseUrl}/${encodedParams}`;

        return NextResponse.json({ success: true, url: checkoutUrl });
    } catch (error) {
        console.error("PAYME LINK ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
