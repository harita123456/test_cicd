const joi = require("joi");

const schema = {
  _userRegistration: joi.object({
    user_name: joi.string().max(100).required("User name"),
    email_address: joi.string().email().required("Email address"),
    mobile_number: joi
      .number()
      .integer()
      .min(1000000000)
      .max(9999999999)
      .message("Mobile number is invalid")
      .allow("Mobile number"),
    country_code: joi.number().allow("Country code"),
    password: joi.string().allow("password"),
    user_type: joi.allow(),
    is_social_login: joi.string().allow("Is social login"),
    profile_url: joi.string().allow("Profile url"),
    social_id: joi.string().allow("Social id"),
    social_platform: joi
      .string()
      .valid("google", "facebook", "apple", "null")
      .allow("Social platform"),
    app_version: joi.string().allow("App version"),
  }),
  _login: joi.object({
    email_address: joi.string().email().allow(),
    user_name: joi.string().allow(),
    mobile_number: joi.string().allow(),
    password: joi.string().allow("password"),
    otp: joi.string().allow("otp"),
    is_social_login: joi.string().allow(),
    social_id: joi.string().allow(),
    profile_url: joi.string().allow(),
    social_platform: joi
      .string()
      .valid("google", "facebook", "apple", "null")
      .allow(),
    app_version: joi.string().allow("App version"),
    device_type: joi.string().valid("android", "ios").required("Device type"),
    device_token: joi.string().required("Device token"),
  }),
  _changePwd: joi.object({
    old_password: joi.string().required("Old password"),
    new_password: joi.string().required("New password"),
  }),
  _resetPwd: joi.object({
    email_address: joi.string().required("Email Address"),
    password: joi.string().required("Password"),
  }),
};

module.exports = schema;
