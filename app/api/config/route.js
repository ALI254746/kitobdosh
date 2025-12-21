import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import SystemConfig from "@/model/SystemConfig";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const config = await SystemConfig.findOne({ key: 'main_config' }).lean();
        
        if (!config) {
            return NextResponse.json({ success: true, data: { contactInfo: { adminTelegram: "@kitobdosh_admin" } } });
        }
        
        // Expose only non-sensitive data
        const publicData = {
            contactInfo: {
                phone: config.contactInfo?.phone,
                email: config.contactInfo?.email,
                tgBotLink: config.contactInfo?.tgBotLink,
                adminTelegram: config.contactInfo?.adminTelegram
            },
            deliveryPrices: config.deliveryPrices
        };
        
        return NextResponse.json({ success: true, data: publicData });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
