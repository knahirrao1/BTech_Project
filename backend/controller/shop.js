const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const Shop = require("../model/shop");

const {
  isAuthenticated,
  isSeller,
  isAdmin
} = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

// Create shop
router.post("/create-shop", async (req, res, next) => {
  try {
    const {
      email
    } = req.body;

    // Checking Previous Registration
    const sellerEmail = await Shop.findOne({
      email
    });
    if (sellerEmail) {
      return next(new ErrorHandler("Shop already exists", 400));
    }

    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    // Sending Verification Email
    const activationToken = createActivationToken(seller);
    const activationUrl = `${process.env.FRONTEND_URL}/seller/activation/${activationToken}`;
    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Link of yout shop activation
NOTE: This will activate your shop account. 
Hello ${seller.name}, please click on the link to activate your shop account :
${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "30m",
  });
};

// Activate Shop
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      activation_token
    } = req.body;

    // Verifying token
    const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (!newSeller) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const {
      name,
      email,
      password,
      zipCode,
      address,
      phoneNumber
    } = newSeller;

    // Checking previous Shop
    let seller = await Shop.findOne({
      email
    });
    if (seller) {
      return next(new ErrorHandler("Shop already exists", 400));
    }

    seller = await Shop.create({
      name,
      email,
      password,
      zipCode,
      address,
      phoneNumber,
    });

    sendShopToken(seller, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Login shop
router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }

    // Checking Shop Details
    const shop = await Shop.findOne({
      email
    }).select("+password");
    if (!shop) {
      return next(new ErrorHandler("shop doesn't exists!", 400));
    }

    // Checking Password Validity
    const isPasswordValid = await shop.comparePassword(password);
    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    sendShopToken(shop, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Load shop
router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) {
      return next(new ErrorHandler("Shop doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Log out from shop
router.get("/logout", catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Update Seller info
router.put("/update-seller-info", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      phoneNumber,
      zipCode
    } = req.body;

    // Verifying Shop Details
    const shop = await Shop.findOne(req.seller._id);
    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;

    await shop.save();

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Update Shop Avatar
router.put("/update-shop-avatar", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      avatar
    } = req.body

    const seller = await Shop.findByIdAndUpdate(req.seller._id, {
      avatar: avatar,
    });

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Forgot Shop Password
router.post("/forgot-shop-password", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      email,
      newPassword,
      confirmPassword
    } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return next(new ErrorHandler("Please provide all fields !", 400));
    }

    // Checking Shop Details
    const shop = await Shop.findOne({
      email
    });
    if (!shop) {
      return next(new ErrorHandler("Shop doesn't exists!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password doesn't matched with each other!", 400)
      );
    }

    const newpassreq = {
      email: email,
      newPassword: newPassword,
    };

    // Get reset password token
    const resetPasswordToken = createActivationToken(newpassreq);
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-shop-password/${resetPasswordToken}`;

    // Sending Email
    try {
      await sendMail({
        email: email,
        subject: "Reset Password",
        message: `Reset Password Link
NOTE: This will change password of your shop account. 
Hello ${shop.name} please click on the link to reset your password : 
${resetPasswordUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email :- ${shop.email} to reset your password!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Reset Password
router.post("/reset-shop-password", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      resetpasswordtoken
    } = req.body;

    // Verifying token
    const passtoken = jwt.verify(resetpasswordtoken, process.env.ACTIVATION_SECRET);
    if (!passtoken) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const {
      email,
      newPassword
    } = passtoken;

    // Checking previous shop
    let shop = await Shop.findOne({
      email
    });

    shop.password = newPassword;

    await shop.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));


// Get Shop info
router.get("/get-shop-info/:id", catchAsyncErrors(async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Admin Routes

// Get All Sellers
router.get("/admin-all-sellers", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const sellers = await Shop.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      sellers,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Delete Seller
router.delete("/delete-seller/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.params.id);

    if (!seller) {
      return next(
        new ErrorHandler("Seller is not available with this id", 400)
      );
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Seller deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

module.exports = router;