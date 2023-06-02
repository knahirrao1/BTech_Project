const express = require("express");
const router = express.Router();

const ErrorHandler = require("../utils/ErrorHandler");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {
  isAuthenticated,
  isSeller,
  isAdmin
} = require("../middleware/auth");

const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");

// Create new order
router.post("/create-order", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      cart,
      shippingAddress,
      user,
      totalPrice,
      paymentInfo
    } = req.body;

    // Group cart items by shopId
    const shopItemsMap = new Map();
    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    // Create an order for each shop
    const orders = [];

    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Get all orders of user
router.get("/get-all-orders/:userId", catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find({
      "user._id": req.params.userId
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Get all orders of Seller
router.get("/get-seller-all-orders/:shopId", catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Update order status for Seller
router.put("/update-order-status/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    async function updateOrder(id, qty) {
      const product = await Product.findById(id);
      product.stock = product.stock - qty;
      product.sold_out = product.sold_out + qty;
      await product.save({
        validateBeforeSave: false
      });
    }

    if (req.body.status === "Delivered") {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * .1;
      await updateSellerInfo(order.totalPrice - serviceCharge);
    }

    await order.save({
      validateBeforeSave: false
    });

    res.status(200).json({
      success: true,
      order,
    });

    async function updateSellerInfo(amount) {
      const seller = await Shop.findById(req.seller.id);
      seller.availableBalance = amount;
      await seller.save();
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Admin Routes

// All Orders
router.get("/admin-all-orders", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

module.exports = router;