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
    image: "https://product.hstatic.net/200000722513/product/1024__5__824c05bb186d4c05826bb25eea92c719_master.png",
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    description: "Premium Android smartphone",
    price: 2799,
    category: "phone",
    image: "https://file.hstatic.net/200000636033/file/icon19_0197366bbf124fed9b939c9b7075c2db.png",
  },
  {
    name: "MacBook Pro M4 14 inch",
    description: "High-performance laptop",
    price: 4999,
    category: "laptop",
    image: "https://product.hstatic.net/200000722513/product/predator-helios-18-ai-ph18-73-eshell-abyssal-black-01_f94a7b2ded8a4e8ab0db6ff0e8863a13.png",
  },
  {
    name: "Dell XPS 15",
    description: "Creative Windows laptop",
    price: 3500,
    category: "laptop",
    image: "https://cdn.hstatic.net/products/200000722513/web__61_of_86__aea66174cf754130b266656c48778519_master.jpg",
  },
  {
    name: "Sony WH-1000XM6",
    description: "Noise-canceling headphones",
    price: 549,
    category: "audio",
    image: "https://cdn.hstatic.net/products/200000722513/gearvn-tai-nghe-khong-day-logitech-g321-lightspeed-white-1_79891fb9dd42452b92c4532c5b1aa4d6_grande.png",
  },
  {
    name: "AirPods Pro 3",
    description: "Apple wireless earbuds",
    price: 399,
    category: "audio",
    image: "https://file.hstatic.net/200000636033/file/icon19_0197366bbf124fed9b939c9b7075c2db.png",
  },
  {
    name: "Logitech MX Master 4",
    description: "Productivity wireless mouse",
    price: 159,
    category: "accessory",
    image: "https://file.hstatic.net/200000722513/file/chuot_aa348bf0177b4795a39ab66d51e62ed7.jpg",
  },
  {
    name: "Razer BlackWidow V5",
    description: "Mechanical gaming keyboard",
    price: 249,
    category: "accessory",
    image: "https://file.hstatic.net/200000722513/file/ban_phim_93a4d3cefd8345dfac23829818a3c5d4.jpg",
  },
  {
    name: "ASUS TUF 27\" 165Hz",
    description: "Gaming monitor 2K 165Hz",
    price: 499,
    category: "monitor",
    image: "https://product.hstatic.net/200000722513/product/asus_pg27aqdm_gearvn_53c46bd0ca1f40f1a7abfb0246800081_e341bb95b0724bee845ba8f093678245_master.jpg",
  },
  {
    name: "iPad Air M2",
    description: "Lightweight tablet for work",
    price: 899,
    category: "tablet",
    image: "https://product.hstatic.net/200000722513/product/asus_vy249hgr_120hz_gearvn_3b944fdc15e449968d9ba0739aaea352_medium.jpg",
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
  const reviewCount = Math.floor(Math.random() * 6) + 5;
  const reviews = [];

  for (let i = 0; i < reviewCount; i++) {
    reviews.push({
      _id: new Types.ObjectId(),
      user: userIds[Math.floor(Math.random() * userIds.length)],
      product: productId,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
    });
  }

  return reviews;
}

async function updateAverageRatingForProduct(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" } } }
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats.length ? stats[0].avgRating : 0
  });
}

//
// ===== MAIN SEED FUNCTION =====
//
async function seedDatabase() {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    await User.insertMany(await buildUsers());
    await Product.insertMany(sampleProducts);

    let reviews = [];
    for (let pid of productIds) reviews.push(...randomReviewsForProduct(pid));
    await Review.insertMany(reviews);

    for (let pid of productIds) await updateAverageRatingForProduct(pid);

    console.log("✔ SEED COMPLETE");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDatabase();
