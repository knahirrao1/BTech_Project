const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const ErrorHandler = require("./middleware/error");

app.use(express.json({
  limit: "50mb"
}));
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "50mb"
}));

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");

// Use Routes
app.use("/api/v2/user", user);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;