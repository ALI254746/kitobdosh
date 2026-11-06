import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getCart, saveCartItem, removeCartItem } from "@/lib/cart-store";


export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const cartItems = await getCart(session.user.id);

        return NextResponse.json({ success: true, cart: cartItems });
    } catch (error) {
        console.error("Cart GET Error:", error);
        return NextResponse.json({ success: false, message: "Savatchani server bilan sinxronlab bo‘lmadi. Shu qurilmadagi nusxa saqlanadi." }, { status: 503 });
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

        if (!item || typeof item !== "object" || typeof item.cartId !== "string" || !item.cartId.trim() || item.cartId.length > 200) {
            return NextResponse.json({ success: false, message: "Invalid item data" }, { status: 400 });
        }

        await saveCartItem(session.user.id, item);

        return NextResponse.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Cart POST Error:", error);
        return NextResponse.json({ success: false, message: "Savatchani server bilan sinxronlab bo‘lmadi. Shu qurilmadagi nusxa saqlanadi." }, { status: 503 });
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


        if (clearAll === 'true') {
            await removeCartItem(session.user.id, null, true);
            return NextResponse.json({ success: true, message: "Cart cleared" });
        }

        if (!cartId) {
            return NextResponse.json({ success: false, message: "CartId required" }, { status: 400 });
        }

        await removeCartItem(session.user.id, cartId, false);

        return NextResponse.json({ success: true, message: "Item removed" });
    } catch (error) {
         console.error("Cart DELETE Error:", error);
        return NextResponse.json({ success: false, message: "Savatchani server bilan sinxronlab bo‘lmadi. Shu qurilmadagi nusxa saqlanadi." }, { status: 503 });
    }
}
