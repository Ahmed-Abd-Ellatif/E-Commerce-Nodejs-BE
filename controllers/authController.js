const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const APiError = require("../utils/apiError");
const User = require("../models/userScema");

// GENERATE TOKEN
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// SIGNUP
exports.signup = asyncHandler(async (req, res) => {
  // 1. Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2. Create token
  const token = generateToken(user._id);
  res.status(201).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
});
// LOGIN
exports.login = asyncHandler(async (req, res, next) => {
  // 1. Check if email and password exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new APiError("Please provide email and password", 400));
  }
  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new APiError("Incorrect email or password", 401));
  }
  // 3. Create token
  const token = generateToken(user._id);
  // 4. Send response
  res.status(200).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
});

// PROTECT
exports.protect = asyncHandler(async (req, res, next) => {
  // 1. Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new APiError("You are not logged in! Please log in to get access.", 401),
    );
  }
  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new APiError(
        "The user belonging to this token does no longer exist.",
        401,
      ),
    );
  }
  // 4. Check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new APiError(
          "User recently changed password! Please log in again.",
          401,
        ),
      );
    }
  }
  // 5. Grant access to protected route
  req.user = currentUser;
  next();
});

// ALLOWED TO ROLES
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new APiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });