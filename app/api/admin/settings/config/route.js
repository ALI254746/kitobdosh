import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import SystemConfig from "@/model/SystemConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    return session && session.user.role === 'admin';
}

export async function GET() {
    try {
        await dbConnect();
        let config = await SystemConfig.findOne({ key: 'main_config' });
        
        if (!config) {
            config = await SystemConfig.create({ key: 'main_config' });
        }
        
        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        if (!await checkAdmin()) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const config = await SystemConfig.findOneAndUpdate(
            { key: 'main_config' },
            { $set: data },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
