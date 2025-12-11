const reviewService = require("../services/review.service");

class ReviewController {

  async createReview(req, res) {
    try {
      console.log("Decoded user from token:", req.user);

      const { rating, comment } = req.body;
      const userId = req.user.userId;   // ✅ FIXED
      const productId = req.params.productId;

      const review = await reviewService.createReview(
        userId,
        productId,
        rating,
        comment
      );

      res.json(review);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getReviews(req, res) {
    try {
      const productId = req.params.productId;
      const reviews = await reviewService.getReviews(productId);
      res.json(reviews);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateReview(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const userId = req.user.userId;   // ✅ FIXED

      const review = await reviewService.updateReview(
        reviewId,
        userId,
        req.body
      );

      res.json(review);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteReview(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const userId = req.user.userId;   // ✅ FIXED
      const isAdmin = req.user.role === "admin";

      const result = await reviewService.deleteReview(
        reviewId,
        userId,
        isAdmin
      );

      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new ReviewController();
