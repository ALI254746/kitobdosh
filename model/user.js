import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "kurier", "kurer", "courier"],
      default: "user",
    },
    // Extended Profile Fields
    fullName: {
      type: String,
      default: ""
    },
    avatar: {
      type: String, 
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    settings: {
        theme: { type: String, enum: ["light", "dark", "celery"], default: "light" },
        fontFamily: { type: String, default: "Inter" },
        darkMode: { type: Boolean, default: false },
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true }
    },
    occupation: {
      type: String,
      enum: ["student", "teacher", "other", "courier", "kurer"],
      default: "other"
    },
    bio: {
      type: String,
      default: ""
    },
    instagram: {
      type: String, 
      default: ""
    },
    telegram: {
      type: String,
      default: ""
    },
    interests: [{
      type: String
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
  },
  { timestamps: true }
);

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", userSchema);
