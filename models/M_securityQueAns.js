const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { TBL_QUE_ANS, TBL_USERS } = require("./");

const schema = mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: TBL_USERS,
    },
    fav_color: {
      type: String,
      required: [true, "Favorite color is required."],
    },
    fav_food: {
      type: String,
      required: [true, "Favorite food is required."],
    },
    fav_actor: {
      type: String,
      required: [true, "Favorite actor is required."],
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);
const Que_Ans = mongoose.model(TBL_QUE_ANS, schema);
module.exports = Que_Ans;
