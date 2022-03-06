const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

// @desc    User register
// @route   POST api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  // create token
  const token = user.getUserJWT();

  res.status(200).json({ success: true, user, token });
});

// @desc    User login
// @route   POST api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please enter an email and password", 400));
  }

  // check user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // create token
  const token = user.getUserJWT();

  res.status(200).json({ success: true, token });
});
