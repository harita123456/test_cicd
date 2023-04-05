const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { TBL_FOLLOWER_FOLLOWING, TBL_USERS } = require("./");

const schema = new mongoose.Schema(
  {
    follower_id: {
      type: Schema.Types.ObjectId,
      ref: TBL_USERS,
      required: [true, "follower id is required"],
    },
    following_id: {
      type: Schema.Types.ObjectId,
      ref: TBL_USERS,
      required: [true, "following id is required"],
    },
    is_accepted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    is_block: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model(TBL_FOLLOWER_FOLLOWING, schema);
module.exports = Notification;
