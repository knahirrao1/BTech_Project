const express = require("express");
const router = express.Router();

const User = require("../model/user");

const jwt = require("jsonwebtoken");

const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");

const {
  isAuthenticated,
  isAdmin
} = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Register User
router.post("/create-user", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    // Checking Previous Registration
    const userEmail = await User.findOne({
      email
    });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    // Sending Verification Email
    const activationToken = createActivationToken(user);
    const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}`;
    try {
      await sendMail({
        email: email,
        subject: "Activate your account",
        message: `Link of yout account activation
NOTE: This will activate your account. 
Hello ${user.name}, please click on the link to activate your account :
${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email :- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "30m",
  });
};

// Activate user
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      activation_token
    } = req.body;

    // Verifying token
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const {
      name,
      email,
      password
    } = newUser;
    // Checking previous user
    let user = await User.findOne({
      email
    });
    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    user = await User.create({
      name,
      email,
      password
    });
    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// login user
router.post("/login-user", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    // Checking User Details
    const user = await User.findOne({
      email
    }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
    }

    // Checking Password Validity
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Load user
router.get("/getuser", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Log out user
router.get("/logout", catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
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

// Update User Details
router.put("/update-user-info", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      email,
      password,
      phoneNumber,
      name
    } = req.body;

    // Verifying User Details
    const user = await User.findOne({
      email
    }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));


// Update User Avatar
router.put("/update-avatar", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      avatar
    } = req.body

    const user = await User.findByIdAndUpdate(req.user.id, {
      avatar: avatar,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Update User Addresses
router.put("/update-user-addresses", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Checking Address of Same Type
    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );
    if (sameTypeAddress) {
      return next(
        new ErrorHandler(`${req.body.addressType} address already exists`)
      );
    }

    // Checking Same Address
    const existsAddress = user.addresses.find(
      (address) => address._id === req.body._id
    );
    if (existsAddress) {
      Object.assign(existsAddress, req.body);
    } else {
      user.addresses.push(req.body);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Delete User Address
router.delete("/delete-user-address/:id", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    await User.updateOne({
      _id: userId,
    }, {
      $pull: {
        addresses: {
          _id: addressId
        }
      }
    });

    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Update user password
router.put("/update-user-password", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(
      req.body.oldPassword
    );
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password doesn't matched with each other!", 400)
      );
    }

    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Forgot Password
router.post("/forgot-password", catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      email,
      newPassword,
      confirmPassword
    } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return next(new ErrorHandler("Please provide all fields !", 400));
    }

    // Checking User Details
    const user = await User.findOne({
      email
    });
    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
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
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;

    // Sending Email
    try {
      await sendMail({
        email: email,
        subject: "Reset Password",
        message: `Reset Password Link
NOTE: This will change password of your account. 
Hello ${user.name} please click on the link to reset your password : 
${resetPasswordUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email :- ${user.email} to reset your password!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Reset Password
router.post("/reset-password", catchAsyncErrors(async (req, res, next) => {
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

    // Checking previous user
    let user = await User.findOne({
      email
    });

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));


// Get user information with Id
router.get("/user-info/:id", catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Admin Routes

// Get All User
router.get("/admin-all-users", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Delete Users
router.delete("/delete-user/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler("User is not available with this id", 400)
      );
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

module.exports = router;