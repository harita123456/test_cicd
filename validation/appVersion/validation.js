const { APISTATUS } = require("../../constants/env");
const AppError = require("../../utils/ErrorHandlers/appError");
const catchAsync = require("../../utils/ErrorHandlers/catchAsync");
const { _addAppVersion, _appVersionCheck } = require("./schema");

module.exports = {
  mAddAppVersion: catchAsync(async (req, res, next) => {
    const value = await _addAppVersion.validate(req.body);
    if (value.error) {
      throw new AppError(value.error.details[0].message, APISTATUS.REQUIRED);
    }
    next();
  }),
  mAppVersionCheck: catchAsync(async (req, res, next) => {
    const value = await _appVersionCheck.validate(req.body);
    if (value.error) {
      throw new AppError(value.error.details[0].message, APISTATUS.REQUIRED);
    }
    next();
  }),
};
