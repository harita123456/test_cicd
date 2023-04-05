const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { TBL_NOTIFICATIONS, TBL_USERS, TBL_FOLLOWER_FOLLOWING } = require("./");

const schema = mongoose.Schema(
  {
    notification_title: {
      type: String,
      required: [true, "Notification title is required."],
    },
    notification_message: {
      type: String,
      required: [true, "Notification message is required."],
    },
    notification_type: {
      type: String,
      enum: ["general", "chat_noti"],
    },
    notification_for: {
      type: String,
      enum: [
        "follow_request",
        "follow_request_accept",
        "follow_request_reject",
        "greeting_msg",
        "message",
      ],
    },
    sender_user: {
      type: Schema.Types.ObjectId,
      ref: TBL_USERS,
      // required: [true, "Sender_id is required."],
    },
    receiver_user: [
      {
        type: Schema.Types.ObjectId,
        ref: TBL_USERS,
        required: [true, "Receiver id is required."],
      },
    ],
    request_id: {
      type: Schema.Types.ObjectId,
      ref: TBL_FOLLOWER_FOLLOWING,
      // required: [true, "Sender_id is required."],
    },
    // deleted_user: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: TBL_USERS,
    //     required: [true, "Delete user id is required."],
    //   },
    // ],
    is_accepted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-accepted, false-Not_accepted
    },
    notification_date: {
      type: Date,
      required: [true, "Notification date is required."],
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);
const Notification = mongoose.model(TBL_NOTIFICATIONS, schema);
module.exports = Notification;
