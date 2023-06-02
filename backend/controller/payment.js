const express = require("express");
const router = express.Router();

const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Processing Payment
router.post("/process", catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
}));

// Getting Stripe API Key
router.get("/stripeapikey", catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApikey: process.env.STRIPE_API_KEY
  });
}));

module.exports = router;