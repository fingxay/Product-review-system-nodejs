const mongoose = require("mongoose");
const Review = require("../models/review.model");
const reviewService = require("../services/review.service");

class ReviewController {

  /* ================= CREATE ================= */
  async createReview(req, res) {
    try {
      const { rating, comment } = req.body;
      const userId = req.user.userId;
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

  /* ================= LIST (with rating filter) ================= */
  async getReviews(req, res) {
    try {
      const productId = req.params.productId;
      const rating = req.query.rating; // ?rating=5

      const reviews = await reviewService.getReviews(
        productId,
        rating
      );

      res.json(reviews);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /* ================= SUMMARY ================= */
  // GET /api/reviews/:productId/summary
  async getReviewSummary(req, res) {
    try {
      const productId = new mongoose.Types.ObjectId(
        req.params.productId
      );

      const result = await Review.aggregate([
        { $match: { product: productId } },
        {
          $facet: {
            overall: [
              {
                $group: {
                  _id: null,
                  average: { $avg: "$rating" },
                  total: { $sum: 1 },
                },
              },
            ],
            byStar: [
              {
                $group: {
                  _id: "$rating",
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]);

      const overall = result[0]?.overall[0] || {
        average: 0,
        total: 0,
      };

      const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      result[0]?.byStar.forEach((s) => {
        stars[s._id] = s.count;
      });

      res.json({
        average: Number(overall.average.toFixed(1)),
        total: overall.total,
        stars,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /* ================= UPDATE ================= */
  async updateReview(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const userId = req.user.userId;

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

  /* ================= DELETE ================= */
  async deleteReview(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const userId = req.user.userId;
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
