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
  static async getAllProducts() {
    return await Product.find();
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
