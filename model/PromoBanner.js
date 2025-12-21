import mongoose from "mongoose";

const promoBannerSchema = new mongoose.Schema({
    badge: {
        type: String,
        default: "🔥 Bugungi chegirma"
    },
    text: {
        type: String,
        required: true,
        default: "Barcha bestsellerlarga 20% chegirma"
    },
    link: {
        type: String,
        default: "/mobile/components/search?type=sale"
    },
    image: {
        type: String, // Cloudinary URL
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Prevent model overwrite or stale schema in development
if (mongoose.models.PromoBanner) {
    delete mongoose.models.PromoBanner;
}

const PromoBanner = mongoose.model("PromoBanner", promoBannerSchema);

export default PromoBanner;
