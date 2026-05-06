const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const APiError = require("../utils/apiError");
const User = require("../models/userScema");
const sendEmail = require("../utils/semdEmail");


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
        new APiError("You are not allowed to access this route", 403),
      );
    }
    next();
  });

// FORGET PASSWORD
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new APiError("There is no user with that email address.", 404));
  }

  // 2. Generate the random 6 digit
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Hash the reset code and set to resetPasswordToken field
  user.passwordResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // Set expire time for reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // 3. Send it to user's email
try {
  await sendEmail({
    email: user.email,
    subject: "Your password reset code (valid for 10 min)",
    message: `Your password reset code is: ${resetCode}`,
  });
  res.status(200).json({
    status: "success",
    message: "Reset code sent to email!",
  });
} catch (err) {
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  return next(
    new APiError(
      "There was an error sending the email. Try again later!",
      500,
    ),
  );
}
});

// VERIFY RESET CODE
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1. Get user based on the email and reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new APiError("Invalid or expired reset code", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Reset code verified successfully",
  });
});

// RESET PASSWORD
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1. Get user based on the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new APiError("There is no user with that email address.", 404));
  }
  // 2. Check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new APiError("Reset code not verified", 400));
  }
  // 3. Update password and clear reset code fields
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  // generate token
  const token = generateToken(user._id);
  
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    token,
  });

});