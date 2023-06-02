const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
  },
  addresses: [{
    country: {
      type: String,
      default: "IN"
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    addressType: {
      type: String,
    },
  }],
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//  Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);