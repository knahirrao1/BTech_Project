const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isSeller,
  isAdmin
} = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");

const ErrorHandler = require("../utils/ErrorHandler");

// Create product
router.post("/create-product", catchAsyncErrors(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid!", 400));
    } else {
      const productData = req.body;

      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}));

// Get all Products of a shop
router.get("/get-all-products-shop/:id", catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find({
      shopId: req.params.id
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}));

// Delete product of a shop
router.delete("/delete-shop-product/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found with this id!", 500));
    }

    res.status(201).json({
      success: true,
      message: "Product Deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}));

// Get all Products
router.get("/get-all-products", catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}));

// Review for a product
router.put("/create-new-review", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      user,
      rating,
      comment,
      productId,
      orderId
    } = req.body;
    if (!rating) {
      return next(new ErrorHandler("Please provide rating!", 400));
    }
    const product = await Product.findById(productId);
    const review = {
      user,
      rating,
      comment,
      productId,
    };

    const isReviewed = product.reviews.find(
      (rev) => rev.user._id === req.user._id
    );
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user._id === req.user._id) {
          (rev.rating = rating), (rev.comment = comment), (rev.user = user);
        }
      });
    } else {
      product.reviews.push(review);
    }

    let sum = 0;
    product.reviews.forEach((rev) => {
      sum = sum + rev.rating;
    });
    product.ratings = sum / product.reviews.length;

    await product.save({
      validateBeforeSave: false
    });

    await Order.findByIdAndUpdate(
      orderId, {
        $set: {
          "cart.$[elem].isReviewed": true
        }
      }, {
        arrayFilters: [{
          "elem._id": productId
        }],
        new: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Reviewed succesfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}));

// Admin Route

// All products
router.get("/admin-all-products", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

module.exports = router;