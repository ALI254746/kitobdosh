"use client";

import { useCart } from "@/app/CartContext";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaBolt } from "react-icons/fa";

export default function BookActions({ book }) {
    const { addToCart, cartItems } = useCart();
    const router = useRouter();
    const unavailable = book.stock <= 0;
    const rentNow = () => {
        if (!cartItems.some(item => item.cartId === book._id + "-rent")) {
            addToCart(book, "rent", 7);
        }
        router.push("/mobile/components/Savatcha");
    };
    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button type="button" disabled={unavailable} onClick={() => addToCart(book, "buy")}
                className="flex-1 bg-[#1F2937] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#96C7B9] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                <FaShoppingCart /> {unavailable ? "Hozircha mavjud emas" : "Savatchaga qo‘shish"}
            </button>
            {book.isRentable && <button type="button" disabled={unavailable} onClick={rentNow}
                className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                <FaBolt /> Hoziroq ijara olish
            </button>}
        </div>
    );
}
