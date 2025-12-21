import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db.Connect';
import Order from '@/model/Order';
import Rent from '@/model/Rent';

// Helper to find document in either Order or Rent
async function findDocument(orderId, paymeTransactionId = null) {
    if (paymeTransactionId) {
        let doc = await Order.findOne({ paymeTransactionId });
        if (!doc) doc = await Rent.findOne({ paymeTransactionId });
        return doc;
    }
    let doc = await Order.findById(orderId);
    if (!doc) doc = await Rent.findById(orderId);
    return doc;
}

// Payme Error Codes
const ERR_INVALID_AMOUNT = -31001;
const ERR_ORDER_NOT_FOUND = -31050;
const ERR_TRANSACTION_NOT_FOUND = -31003;
const ERR_ORDER_ALREADY_PAID = -31051;

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { method, params, id } = body;

        switch (method) {
            case 'CheckPerformTransaction':
                return await handleCheckPerformTransaction(params, id);
            case 'CreateTransaction':
                return await handleCreateTransaction(params, id);
            case 'CheckTransaction':
                return await handleCheckTransaction(params, id);
            case 'PerformTransaction':
                return await handlePerformTransaction(params, id);
            case 'CancelTransaction':
                return await handleCancelTransaction(params, id);
            default:
                return NextResponse.json({
                    id,
                    error: { code: -32601, message: "Method not found" }
                });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleCheckPerformTransaction(params, id) {
    const orderId = params.account.order_id;
    const doc = await findDocument(orderId);

    if (!doc) {
        return NextResponse.json({ id, error: { code: ERR_ORDER_NOT_FOUND, message: "Buyurtma topilmadi" } });
    }

    if (doc.totalPrice * 100 !== params.amount) {
        return NextResponse.json({ id, error: { code: ERR_INVALID_AMOUNT, message: "Noto'g'ri summa" } });
    }

    return NextResponse.json({ id, result: { allow: true } });
}

async function handleCreateTransaction(params, id) {
    const orderId = params.account.order_id;
    const doc = await findDocument(orderId);

    if (!doc) return NextResponse.json({ id, error: { code: ERR_ORDER_NOT_FOUND } });

    // Mark document with transaction info
    doc.paymeTransactionId = params.id;
    doc.paymeTime = params.time;
    doc.paymentStatus = 'pending';
    await doc.save();

    return NextResponse.json({
        id,
        result: {
            create_time: Date.now(),
            transaction: params.id,
            state: 1
        }
    });
}

async function handlePerformTransaction(params, id) {
    const doc = await findDocument(null, params.id);
    if (!doc) return NextResponse.json({ id, error: { code: ERR_TRANSACTION_NOT_FOUND } });

    if (doc.paymentStatus !== 'paid') {
        doc.paymentStatus = 'paid';
        if (doc.status === 'pending') {
            doc.status = 'processing'; 
        }
        await doc.save();
    }

    return NextResponse.json({
        id,
        result: {
            transaction: params.id,
            perform_time: Date.now(),
            state: 2
        }
    });
}

async function handleCheckTransaction(params, id) {
    const doc = await findDocument(null, params.id);
    if (!doc) return NextResponse.json({ id, error: { code: ERR_TRANSACTION_NOT_FOUND } });

    return NextResponse.json({
        id,
        result: {
            create_time: doc.paymeTime || 0,
            perform_time: doc.paymentStatus === 'paid' ? Date.now() : 0,
            cancel_time: 0,
            transaction: params.id,
            state: doc.paymentStatus === 'paid' ? 2 : 1,
            reason: null
        }
    });
}

async function handleCancelTransaction(params, id) {
    const doc = await findDocument(null, params.id);
    if (!doc) return NextResponse.json({ id, error: { code: ERR_TRANSACTION_NOT_FOUND } });

    doc.paymentStatus = 'failed';
    await doc.save();

    return NextResponse.json({
        id,
        result: {
            transaction: params.id,
            cancel_time: Date.now(),
            state: -1
        }
    });
}
