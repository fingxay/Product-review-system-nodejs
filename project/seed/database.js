// project/seed/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const { Types } = mongoose;

const Product = require("../models/product.model");
const User = require("../models/user.model");
const Review = require("../models/review.model");

const { hashPassword } = require("../utils/hashing");
const connectDB = require("../utils/db");

//
// ===== TẠO ID CỐ ĐỊNH =====
//
const adminId = new Types.ObjectId();
const userIds = Array.from({ length: 10 }, () => new Types.ObjectId());
const productIds = Array.from({ length: 10 }, () => new Types.ObjectId());

//
// ===== USERS =====
//
async function buildUsers() {
  const adminPwd = await hashPassword("admin123");

  const users = [
    {
      _id: adminId,
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPwd,
      role: "admin",
    },
  ];

  for (let i = 0; i < 10; i++) {
    users.push({
      _id: userIds[i],
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      passwordHash: await hashPassword("user123"),
      role: "user",
    });
  }

  return users;
}

//
// ===== PRODUCTS =====
//
const sampleProducts = [
  {
    name: "iPhone 16 Pro",
    description: "Apple flagship smartphone 2025",
    price: 2999,
    category: "phone",
    image: "https://store.storeimages.cdn-apple.com/iphone-16-pro.jpg",
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    description: "Premium Android smartphone",
    price: 2799,
    category: "phone",
    image: "https://images.samsung.com/s25-ultra.jpg",
  },
  {
    name: "MacBook Pro M4 14 inch",
    description: "High-performance laptop",
    price: 4999,
    category: "laptop",
    image: "https://store.storeimages.cdn-apple.com/macbook-pro-m4.jpg",
  },
  {
    name: "Dell XPS 15",
    description: "Creative Windows laptop",
    price: 3500,
    category: "laptop",
    image: "https://i.dell.com/dell-xps-15.jpg",
  },
  {
    name: "Sony WH-1000XM6",
    description: "Noise-canceling headphones",
    price: 549,
    category: "audio",
    image: "https://sony.com/wh1000xm6.jpg",
  },
  {
    name: "AirPods Pro 3",
    description: "Apple wireless earbuds",
    price: 399,
    category: "audio",
    image: "https://store.storeimages.cdn-apple.com/airpods-pro-3.jpg",
  },
  {
    name: "Logitech MX Master 4",
    description: "Productivity wireless mouse",
    price: 159,
    category: "accessory",
    image: "https://resource.logitech.com/mx-master-4.jpg",
  },
  {
    name: "Razer BlackWidow V5",
    description: "Mechanical gaming keyboard",
    price: 249,
    category: "accessory",
    image: "https://assets.razerzone.com/blackwidow-v5.jpg",
  },
  {
    name: "ASUS TUF 27\" 165Hz",
    description: "Gaming monitor 2K 165Hz",
    price: 499,
    category: "monitor",
    image: "https://dlcdnwebimgs.asus.com/tuf-gaming-monitor.jpg",
  },
  {
    name: "iPad Air M2",
    description: "Lightweight tablet for work",
    price: 899,
    category: "tablet",
    image: "https://store.storeimages.cdn-apple.com/ipad-air-m2.jpg",
  },
].map((p, idx) => ({ ...p, _id: productIds[idx] }));

//
// ===== COMMENT TEMPLATES =====
//
const commentTemplates = [
  "Sản phẩm rất tốt!",
  "Dùng ổn, đáng tiền.",
  "Chất lượng bình thường.",
  "Không như mong đợi.",
  "Thiết kế đẹp, hiệu năng tốt.",
  "Pin hơi yếu nhưng chấp nhận.",
  "Giao hàng nhanh.",
  "Sẽ mua lại lần nữa.",
  "Phù hợp giá tiền.",
  "Tạm ổn."
];

//
// ===== RANDOM REVIEW GENERATOR =====
//
function randomReviewsForProduct(productId) {
  const reviewCount = Math.floor(Math.random() * 6) + 5; // 5–10 reviews
  const reviews = [];

  for (let i = 0; i < reviewCount; i++) {
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
    const randomRating = Math.floor(Math.random() * 5) + 1;
    const randomComment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];

    reviews.push({
      _id: new Types.ObjectId(),
      user: randomUser,
      product: productId,
      rating: randomRating,
      comment: randomComment,
    });
  }

  return reviews;
}

//
// ===== MAIN SEED FUNCTION =====
//
async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    console.log("Creating users...");
    const users = await buildUsers();
    await User.insertMany(users);

    console.log("Creating products...");
    await Product.insertMany(sampleProducts);

    console.log("Creating reviews...");
    let allReviews = [];
    for (let productId of productIds) {
      allReviews.push(...randomReviewsForProduct(productId));
    }
    await Review.insertMany(allReviews);

    console.log("✔ SEED COMPLETE");
    console.log("Admin login:");
    console.log("  email: admin@example.com");
    console.log("  password: admin123");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDatabase();
