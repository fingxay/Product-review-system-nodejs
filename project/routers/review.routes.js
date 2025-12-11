const router = require("express").Router();
const authMiddleware = require("../utils/authMiddleware");
const adminMiddleware = require("../utils/adminMiddleware");
const reviewController = require("../controllers/review.controller");

// Create review
router.post("/:productId", authMiddleware, reviewController.createReview);

// Get reviews by product
router.get("/:productId", reviewController.getReviews);

// Update review (user only)
router.put("/:reviewId", authMiddleware, reviewController.updateReview);

// Delete review (user or admin)
router.delete(
  "/:reviewId",
  authMiddleware,
  reviewController.deleteReview
);

module.exports = router;
