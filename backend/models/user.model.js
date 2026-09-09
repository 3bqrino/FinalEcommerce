const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  governorate: {
    type: String,
    required: true,
    trim: true,
  },

  city: {
    type: String,
    required: true,
    trim: true,
  },

  street: {
    type: String,
    required: true,
    trim: true,
  },

  building: {
    type: String,
    required: true,
    trim: true,
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    nationalId: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: false,
      default: null,
    },

    address: {
      type: [addressSchema],
      default: [],
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ isDeleted: 1, createdAt: -1 });
userSchema.index({ isDeleted: 1, name: 1 });
userSchema.index({ isDeleted: 1, email: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isCorrectPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
