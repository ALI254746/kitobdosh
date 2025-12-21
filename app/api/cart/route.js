import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import redis from "@/lib/redis";

// Helper to get helper key
const getCartKey = (userId) => `cart:${userId}`;

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const cartKey = getCartKey(session.user.id);
        const cartData = await redis.hgetall(cartKey);

        // Convert Hash to Array
        const cartItems = Object.values(cartData).map(item => JSON.parse(item));

        return NextResponse.json({ success: true, cart: cartItems });
    } catch (error) {
        console.error("Cart GET Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { item } = body; 
        // item structure expected: { cartId: "...", _id: "...", title: "...", ... }

        if (!item || !item.cartId) {
            return NextResponse.json({ success: false, message: "Invalid item data" }, { status: 400 });
        }

        const cartKey = getCartKey(session.user.id);
        
        // Save to Redis Hash
        // Field: cartId, Value: JSON string of item
        await redis.hset(cartKey, item.cartId, JSON.stringify(item));
        
        // Optional: Set expire time for cart (e.g., 30 days) to auto-clean old carts
        await redis.expire(cartKey, 30 * 24 * 60 * 60);

        return NextResponse.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Cart POST Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const cartId = searchParams.get("cartId");
        const clearAll = searchParams.get("clearAll");

        const cartKey = getCartKey(session.user.id);

        if (clearAll === 'true') {
            await redis.del(cartKey);
            return NextResponse.json({ success: true, message: "Cart cleared" });
        }

        if (!cartId) {
            return NextResponse.json({ success: false, message: "CartId required" }, { status: 400 });
        }

        await redis.hdel(cartKey, cartId);

        return NextResponse.json({ success: true, message: "Item removed" });
    } catch (error) {
         console.error("Cart DELETE Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
