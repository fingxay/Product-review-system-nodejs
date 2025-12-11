// project/seed/seed.js
require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("./project/models/product.model");
const User = require("./project/models/user.model");
const { hashPassword } = require("./project/utils/hashing");
const connectDB = require("./project/utils/db");

// ===== SAMPLE PRODUCTS WITH IMAGES =====
const sampleProducts = [
  {
    name: "iPhone 16 Pro",
    description: "Apple flagship smartphone 2025",
    price: 2999,
    category: "phone",
    image: "https://store.storeimages.cdn-apple.com/iphone-16-pro.jpg"
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    description: "Premium Android smartphone",
    price: 2799,
    category: "phone",
    image: "https://images.samsung.com/s25-ultra.jpg"
  },
  {
    name: "MacBook Pro M4 14 inch",
    description: "High-performance laptop for professionals",
    price: 4999,
    category: "laptop",
    image: "https://store.storeimages.cdn-apple.com/macbook-pro-m4.jpg"
  },
  {
    name: "Dell XPS 15",
    description: "Powerful Windows laptop for creators",
    price: 3500,
    category: "laptop",
    image: "https://i.dell.com/dell-xps-15.jpg"
  },
  {
    name: "Sony WH-1000XM6",
    description: "Noise-canceling wireless headphones",
    price: 549,
    category: "audio",
    image: "https://sony.com/wh1000xm6.jpg"
  },
  {
    name: "AirPods Pro 3",
    description: "True wireless earbuds by Apple",
    price: 399,
    category: "audio",
    image: "https://store.storeimages.cdn-apple.com/airpods-pro-3.jpg"
  },
  {
    name: "Logitech MX Master 4",
    description: "Productivity wireless mouse",
    price: 159,
    category: "accessory",
    image: "https://resource.logitech.com/mx-master-4.jpg"
  },
  {
    name: "Razer BlackWidow V5",
    description: "Mechanical gaming keyboard",
    price: 249,
    category: "accessory",
    image: "https://assets.razerzone.com/blackwidow-v5.jpg"
  },
  {
    name: "ASUS TUF Gaming Monitor 27\"",
    description: "2K 165Hz gaming monitor",
    price: 499,
    category: "monitor",
    image: "https://dlcdnwebimgs.asus.com/tuf-gaming-monitor.jpg"
  },
  {
    name: "Apple iPad Air M2",
    description: "Lightweight tablet for learning & work",
    price: 899,
    category: "tablet",
    image: "https://store.storeimages.cdn-apple.com/ipad-air-m2.jpg"
  }
];

// ===== SAMPLE USERS =====
const sampleUsers = async () => {
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  return [
    {
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: "admin"
    },
    {
      username: "normaluser",
      email: "user@example.com",
      passwordHash: userPassword,
      role: "user"
    }
  ];
};

// ===== MAIN SEED FUNCTION =====
async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Clearing existing data...");
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Inserting products...");
    await Product.insertMany(sampleProducts);

    console.log("Inserting users...");
    const users = await sampleUsers();
    await User.insertMany(users);

    console.log("\n=== SEED COMPLETE! ===");
    console.log("Admin Login:");
    console.log("  email: admin@example.com");
    console.log("  password: admin123");

    console.log("\nUser Login:");
    console.log("  email: user@example.com");
    console.log("  password: user123");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDatabase();
