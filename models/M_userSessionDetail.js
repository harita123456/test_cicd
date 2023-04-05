const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { TBL_USER_SESSION_DETAILS, TBL_USERS } = require("./");

const schema = mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: TBL_USERS,
    },
    app_version: {
      type: String,
      required: [true, "App version is required."],
    },
    device_type: {
      type: String,
      enum: ["ios", "android"],
      required: [true, "Device type is required."],
    },
    device_token: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);

const User_Session_Detail = mongoose.model(TBL_USER_SESSION_DETAILS, schema);
module.exports = User_Session_Detail;
