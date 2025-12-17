// project/services/product.service.js
const Product = require("../models/product.model");

class ProductService {
  // CREATE
  static async createProduct(data) {
    const product = new Product(data);
    await product.save();
    return product;
  }

  // GET ALL
  // GET ALL (supports category filter)
  static async getAllProducts(filters = {}) {
    const query = {};
    const sort = {};

    // filter category
    if (filters.category) {
      query.category = String(filters.category).trim().toLowerCase();
    }

    // sort theo rating
    // sort=rating_asc | rating_desc
    if (filters.sort === "rating_asc") {
      sort.averageRating = 1;
    }

    if (filters.sort === "rating_desc") {
      sort.averageRating = -1;
    }

    // fallback: mới nhất
    if (!Object.keys(sort).length) {
      sort.createdAt = -1;
    }

    return await Product.find(query).sort(sort);
  }



  // GET BY ID
  static async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  // UPDATE
  static async updateProduct(id, data) {
    const updated = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new Error("Product not found");
    return updated;
  }

  // DELETE
  static async deleteProduct(id) {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) throw new Error("Product not found");

    return { message: "Product deleted successfully" };
  }

  // ✅ TOP RATED (Ranking API)
  // limit: số lượng sản phẩm muốn lấy (mặc định 10)
  static async getTopRatedProducts(limit = 10) {
    const n = Number(limit);
    const safeLimit = Number.isFinite(n) && n > 0 ? n : 10;

    return await Product.find()
      .sort({ averageRating: -1, createdAt: -1 }) // rating cao trước, cùng rating thì mới hơn trước
      .limit(safeLimit);
  }
}

module.exports = ProductService;
