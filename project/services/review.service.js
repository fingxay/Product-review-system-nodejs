const Review = require("../models/review.model");
const Product = require("../models/product.model");

class ReviewService {

  // Create review
  async createReview(userId, productId, rating, comment) {
    // Check if reviewed before
    const existing = await Review.findOne({ user: userId, product: productId });
    if (existing) {
      throw new Error("Bạn đã review sản phẩm này rồi!");
    }

    // Create new review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment
    });

    await this.updateProductRating(productId);

    return review;
  }

  // Update review
  async updateReview(reviewId, userId, data) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review không tồn tại!");

    if (String(review.user) !== userId) {
      throw new Error("Bạn không có quyền sửa review này!");
    }

    review.rating = data.rating ?? review.rating;
    review.comment = data.comment ?? review.comment;

    await review.save();
    await this.updateProductRating(review.product);

    return review;
  }

  // Delete review
  async deleteReview(reviewId, userId, isAdmin) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review không tồn tại!");

    // chỉ chủ review hoặc admin được xoá
    if (!isAdmin && String(review.user) !== userId) {
      throw new Error("Bạn không có quyền xoá review này!");
    }

    await review.deleteOne();

    await this.updateProductRating(review.product);

    return { message: "Đã xoá review!" };
  }

  // Get all reviews for product (support filter by rating)
  async getReviews(productId, rating) {
    const filter = {
      product: productId
    };

    // Nếu có query rating (?rating=5)
    if (rating) {
      filter.rating = Number(rating);
    }

    return Review.find(filter)
      .sort({ createdAt: -1 }) // mới nhất lên trước
      .populate("user", "username email");
  }


  // Calculate and update average rating
  async updateProductRating(productId) {
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      { $group: { _id: "$product", avgRating: { $avg: "$rating" } } }
    ]);

    const avg = stats.length > 0 ? stats[0].avgRating : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating: avg
    });
  }
}

module.exports = new ReviewService();
