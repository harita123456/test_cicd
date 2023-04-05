const mongoose = require("mongoose");
const { TBL_USERS } = require("./");

const schema = mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, "User name is required."],
    },
    profile_picture: {
      type: String,
    },
    email_address: {
      type: String,
      required: [true, "Email address is required."],
    },
    mobile_number: {
      type: Number,
      trim: true,
      // required: [true, "Mobile number is required."],

      // unique: [true, "Mobile number is already exists."],
    },
    country_code: {
      type: Number,
      // required: [true, "Country code is required."],
    },
    password: {
      type: String,
      default: null,
      // required: [true, "Password is required."],
    },
    notification_badge: {
      type: Number,
      default: 0,
    },
    is_social_login: {
      type: Boolean,
      enum: [true, false],
      default: false, // true- login with social id, false- normal login
    },
    profile_url: {
      type: String,
    },
    social_id: {
      type: String,
      default: null,
    },
    social_platform: {
      type: String,
      enum: ["google", "facebook", "apple", null],
      default: null,
    },
    user_type: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    is_self_delete: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    is_reset_req: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    is_block: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-User_Block, false-User_Unblock
    },
    is_login: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-Show, false-Not_show
    },
    is_online: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-Show, false-Not_show
    },
    is_email_verify: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-verified, false-Not_verified
    },
    is_mobile_verify: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-verified, false-Not_verified
    },
    email_otp: {
      type: Number,
      length: [4, "OTP must be 4 digit."],
      default: null,
      // required: [true, "OTP is required."]
    },
    mobile_otp: {
      type: Number,
      length: [4, "OTP must be 4 digit."],
      default: null,
      // required: [true, "OTP is required."]
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model(TBL_USERS, schema);

module.exports = User;
