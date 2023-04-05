const joi = require("joi");

const schema = {
  _addAppVersion: joi.object({
    app_version: joi.string().required("App version"),
    app_mode: joi
      .string()
      .valid("maintenance", "review", "testing")
      .required("App mode"),
    app_update_status: joi
      .string()
      .valid("is_force_update", "is_not_need")
      .required("App update status"),
    app_platform: joi.string().valid("ios", "android").required("App platform"),
    app_url: joi.string().required("App url"),
    is_live: joi.string().required("Is live"),
  }),
  _appVersionCheck: joi.object({
    app_version: joi.string().required("App version"),
    user_id: joi.allow(),
    device_type: joi.string().valid("ios", "android").required("Device type"),
    device_token: joi.string().required("Device token"),
  }),
};

module.exports = schema;
