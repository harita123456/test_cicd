const mongoose = require("mongoose");
const { TBL_CHAT, TBL_CHAT_ROOM, TBL_USERS } = require("./");

const mediaFileImage = new mongoose.Schema([
  {
    file_type: {
      type: String,
      enum: ["image", "video"],
      required: [true, "File type is required."],
    },
    file_name: {
      type: String,
    },
    thumb_url: {
      type: String,
    },
  },
]);

const schema = mongoose.Schema(
  {
    chat_room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TBL_CHAT_ROOM,
      required: [true, "Chat room Id is required."],
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TBL_USERS,
      required: [true, "Sender id is required."],
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TBL_USERS,
      required: [true, "Receiver id is required."],
    },
    message_time: {
      type: String,
      required: [true, "Message time is required."],
    },
    message: {
      type: String,
    },
    message_type: {
      type: String,
      enum: ["text", "media"],
      required: [true, "Message type is required."],
    },
    media_file: {
      type: [mediaFileImage],
    },
    is_read: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-read, false-unread
    },
    is_delete_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: TBL_USERS,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Chat = mongoose.model(TBL_CHAT, schema);
module.exports = Chat;
