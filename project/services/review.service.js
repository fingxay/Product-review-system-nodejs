const Review = require("../models/review.model");
const Product = require("../models/product.model");

class ReviewService {

  // ================= CREATE =================
  async createReview(userId, productId, rating, comment) {
    const existing = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existing) {
      throw new Error("Bạn đã review sản phẩm này rồi!");
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    await this.updateProductRating(productId);

    return review;
  }

  // ================= UPDATE =================
  async updateReview(reviewId, userId, data) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review không tồn tại!");

    if (String(review.user) !== userId) {
      throw new Error("Bạn không có quyền sửa review này!");
    }

    if (data.rating !== undefined) review.rating = data.rating;
    if (data.comment !== undefined) review.comment = data.comment;

    await review.save();
    await this.updateProductRating(review.product);

    return review;
  }

  // ================= DELETE =================
  async deleteReview(reviewId, userId, isAdmin) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review không tồn tại!");

    if (!isAdmin && String(review.user) !== userId) {
      throw new Error("Bạn không có quyền xoá review này!");
    }

    const productId = review.product;

    await review.deleteOne();
    await this.updateProductRating(productId);

    return { message: "Đã xoá review!" };
  }

  // ================= LIST =================
  async getReviews(productId, rating) {
    const filter = { product: productId };
    if (rating) filter.rating = Number(rating);

    return Review.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "username email");
  }

  // ================= ⭐ CORE FIX =================
  async updateProductRating(productId) {
  const mongoose = require("mongoose");

  const pid = new mongoose.Types.ObjectId(String(productId));

  const stats = await Review.aggregate([
    { $match: { product: pid } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" } } },
  ]);

  const avg = stats.length > 0 ? stats[0].avgRating : 0;

  await Product.findByIdAndUpdate(pid, {
    averageRating: avg,
  });
}

}

module.exports = new ReviewService();
