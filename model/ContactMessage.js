import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional link to registered user
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["general", "suggestion", "complaint"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
  },
  { timestamps: true }
);

// Prevent mongoose overwrite warning
if (mongoose.models.ContactMessage) {
  delete mongoose.models.ContactMessage;
}

export default mongoose.model("ContactMessage", contactMessageSchema);
