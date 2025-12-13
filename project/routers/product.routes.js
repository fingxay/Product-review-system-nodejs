const router = require("express").Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../utils/authMiddleware");
const adminMiddleware = require("../utils/adminMiddleware");

// Public routes
router.get("/", productController.getProducts);

// ✅ TOP RATED (ranking) - phải đặt trước "/:id"
router.get("/top-rated", productController.getTopRatedProducts);

router.get("/:id", productController.getProduct);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, adminMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
