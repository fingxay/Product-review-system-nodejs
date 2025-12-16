const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ HÌNH ẢNH SẢN PHẨM
    image: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ ĐIỂM TRUNG BÌNH (tính từ bảng review)
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // tự tạo createdAt & updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
