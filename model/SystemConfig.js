import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'main_config'
    },
    deliveryPrices: {
        standard: { type: Number, default: 15000 },
        express: { type: Number, default: 30000 }
    },
    rentalRules: {
        maxDays: { type: Number, default: 30 },
        penaltyPerDay: { type: Number, default: 2000 },
        minDeposit: { type: Number, default: 50000 }
    },
    contactInfo: {
        phone: { type: String, default: "+998 90 123 45 67" },
        address: { type: String, default: "Toshkent shahri, Chilonzor tumani" },
        tgBotLink: { type: String, default: "https://t.me/kitobdosh_bot" },
        adminTelegram: { type: String, default: "@kitobdosh_admin" },
        email: { type: String, default: "support@kitobdosh.uz" }
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

if (mongoose.models.SystemConfig) {
    delete mongoose.models.SystemConfig;
}

export default mongoose.model("SystemConfig", systemConfigSchema);
