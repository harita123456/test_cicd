const mongoose = require("mongoose");
const { TBL_CHAT_ROOM, TBL_USERS } = require("./");

const schema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TBL_USERS,
      required: [true, "User Id is required."],
    },
    other_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TBL_USERS,
      required: [true, "Other user Id is required."],
    },
    room_code: {
      type: Number,
      required: [true, "Room Id is required."],
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);

const Chat_Room = mongoose.model(TBL_CHAT_ROOM, schema);
module.exports = Chat_Room;
