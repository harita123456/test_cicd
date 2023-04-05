const { APISTATUS } = require("../../constants/env");
const AppError = require("../../utils/ErrorHandlers/appError");
const catchAsync = require("../../utils/ErrorHandlers/catchAsync");
const {
  _userRegistration,
  _login,
  _changePwd,
  _resetPwd,
} = require("./schema");

module.exports = {
  mUserRegistration: catchAsync(async (req, res, next) => {
    const value = await _userRegistration.validate(req.body);
    if (value.error) {
      throw new AppError(value.error.details[0].message, APISTATUS.REQUIRED);
    }
    next();
  }),
  mLoginUserValidation: catchAsync(async (req, res, next) => {
    const value = await _login.validate(req.body);
    if (value.error) {
      throw new AppError(value.error.details[0].message, APISTATUS.REQUIRED);
    }
    next();
  }),
  mChangePassword: catchAsync(async (req, res, next) => {
    const value = await _changePwd.validate(req.body);
    if (value.error) {
      throw new AppError(value.error.details[0].message, APISTATUS.REQUIRED);
    }
    next();
  }),
  mResetPassword: catchAsync(async (req, res, next) => {
    const value = await _resetPwd.validate(req.body);
    if (value.error) {
      throw new AppError(value.error.details[0].message, APISTATUS.REQUIRED);
    }
    next();
  }),
};
