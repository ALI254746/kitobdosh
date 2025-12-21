import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Kitob nomi kiritilishi shart"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Muallif ismi kiritilishi shart"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Kitob haqida ma'lumot kiritilishi shart"],
    },
    price: {
      type: Number,
      required: [true, "Kitob narxi kiritilishi shart"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Kategoriya tanlanishi shart"],
      enum: [
        "Badiiy Adabiyotlar",
        "Darsliklar va Qo'llanmalar",
        "Bolalar Adabiyoti",
        "Psixologiya va Biznes",
        "Ilmiy Kitoblar",
        "Diniy Adabiyotlar",
        "Boshqa"
      ],
    },
    images: {
      type: [String], // Rasmlar URL arrayi
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Kamida bitta rasm yuklash shart",
      },
    },
    cloudinaryIds: {
      type: [String], // Cloudinary public_ids for images
      default: []
    },
    stock: {
      type: Number,
      default: 1, // Mavjud nusxalar soni
      min: 0,
    },
    condition: {
      type: String,
      enum: ["Yangi", "Yaxshi", "O'rta", "Eski"],
      default: "Yangi",
    },
    language: {
        type: String,
        default: "O'zbek",
        enum: ["O'zbek", "Rus", "Ingliz", "Boshqa"]
    },
    pages: {
        type: Number,
    },
    year: {
        type: Number,
    },
    publisher: {
        type: String,
        trim: true,
        default: "Kitobdosh"
    },
    // Agar kelajakda ijaraga berish ham xuddi shu modelda bo'lsa:
    isRentable: {
        type: Boolean,
        default: false
    },
    rentalPricePerDay: {
        type: Number,
        default: 0
    },
    // Kitob kim tomonidan qo'shilgani
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    // Reyting tizimi
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
