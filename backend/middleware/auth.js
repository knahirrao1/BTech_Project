const ErrorHandler = require("../utils/ErrorHandler");

const catchAsyncErrors = require("./catchAsyncErrors");

const jwt = require("jsonwebtoken");

const User = require("../model/user");
const Shop = require("../model/shop");

// Checking User Authentication
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {
        token
    } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
});

// Checking if user is seller
exports.isSeller = catchAsyncErrors(async (req, res, next) => {
    const {
        seller_token
    } = req.cookies;
    if (!seller_token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }
    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
    req.seller = await Shop.findById(decoded.id);
    next();
});

// Checking if Admin
exports.isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} can not access this resources!`))
        };
        next();
    }
}