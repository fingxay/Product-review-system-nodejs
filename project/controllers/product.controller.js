const ProductService = require("../services/product.service");
const catchAsync = require("../utils/catchAsync");

exports.createProduct = catchAsync(async (req, res) => {
  const product = await ProductService.createProduct(req.body);
  res.status(201).json({
    success: true,
    message: "Thêm sản phẩm thành công",
    data: product,
  });
});

exports.getProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);
  res.json(products);
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  res.json(product);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const updated = await ProductService.updateProduct(req.params.id, req.body);
  res.json({
    success: true,
    message: "Cập nhật sản phẩm thành công",
    data: updated,
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await ProductService.deleteProduct(req.params.id);
  res.json({
    success: true,
    message: "Xóa sản phẩm thành công",
  });
});

/**
 * ✅ GET TOP RATED PRODUCTS
 * GET /api/products/top-rated?limit=5
 */
exports.getTopRatedProducts = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const products = await ProductService.getTopRatedProducts(limit);
  res.json(products);
});
