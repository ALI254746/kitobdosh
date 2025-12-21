const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#52C6DA",
    },
    logoEmoji: {
      type: String,
      default: "📚",
    },
    bannerUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "Eng sara asarlar to'plami",
    },
    isOfficial: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Delete existing model if it exists to avoid OverwriteModelError in dev
if (mongoose.models.Store) {
  delete mongoose.models.Store;
}

module.exports = mongoose.model("Store", StoreSchema);
