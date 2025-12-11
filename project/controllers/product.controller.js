const ProductService = require("../services/product.service");
const catchAsync = require("../utils/catchAsync");

exports.createProduct = catchAsync(async (req, res) => {
  const product = await ProductService.createProduct(req.body);
  res.status(201).json(product);
});

exports.getProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getAllProducts();
  res.json(products);
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  res.json(product);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const updated = await ProductService.updateProduct(req.params.id, req.body);
  res.json(updated);
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductService.deleteProduct(req.params.id);
  res.json(result);
});
