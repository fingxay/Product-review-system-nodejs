const router = require("express").Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../utils/authMiddleware");
const adminMiddleware = require("../utils/adminMiddleware");

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, adminMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
