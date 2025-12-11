const AuthService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");

exports.register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  res.json(result);
});

exports.login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  res.json(result);
});
