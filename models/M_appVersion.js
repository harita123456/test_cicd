const mongoose = require("mongoose");
const { TBL_APP_VERSIONS } = require("./");

const schema = mongoose.Schema(
  {
    app_version: {
      type: String,
      required: [true, "App version is required."],
    },
    app_mode: {
      type: String,
      enum: ["maintenance", "review", "testing"],
      default: "maintenance",
    },
    app_update_status: {
      type: String,
      enum: ["is_force_update", "is_not_need"],
      default: "is_not_need",
    },
    app_platform: {
      type: String,
      enum: ["ios", "android"],
      required: [true, "App platform is required."],
    },
    app_url: {
      type: String,
      required: [true, "App URL is required."],
    },
    is_live: {
      type: Boolean,
      enum: [true, false],
      default: true, // true-Live, false-Not live
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);

const App_Version = mongoose.model(TBL_APP_VERSIONS, schema);
module.exports = App_Version;
