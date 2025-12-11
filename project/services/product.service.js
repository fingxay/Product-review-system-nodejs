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
}

module.exports = ProductService;
