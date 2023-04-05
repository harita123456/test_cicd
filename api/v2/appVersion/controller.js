const { APISTATUS } = require("../../constants/env");
const AppError = require("../../utils/ErrorHandlers/appError");
const catchAsync = require("../../utils/ErrorHandlers/catchAsync");

const { sAddAppVersion, sAppVersionCheck } = require("./service");
const { sGetUserById } = require("../user/service");

const {
  successRes,
  errorRes,
} = require("../../utils/commonFunctions/commonFun");

module.exports = {
  /* Add App Version Api

      URL : {{base_url}}/api/app_version/add_app_version
      Created By: Vrushti Vekariya
      Date      : 22/02/2023
      Header    : Not required 
      parameters: {
        app_version 
        app_mode (maintenance ,review, testing)
        app_update_status (is_force_update, is_not_need) 
        app_platform (ios, android) 
        app_url 
        is_live (true/ false) 
      }
  */
  cAddAppVersion: catchAsync(async (req, res, next) => {
    const body = req.body;

    const Result = await sAddAppVersion(body);

    return successRes(res, "App version added successfully", Result);
  }),

  /* Add App Version Check Api

    URL : {{base_url}}/api/app_version/check_app_version
    Created By: Vrushti Vekariya
    Date      : 22/02/2023
    Header    : Not required 
    parameters: {
      app_version 
      user_id (optional)
      app_platform (ios, android) 
      device_token
    }
  */
  cAppVersionCheck: catchAsync(async (req, res, next) => {
    const body = req.body;
    var result = await sAppVersionCheck(body);

    if (body.user_id) {
      var find_user = await sGetUserById(body.user_id);
      result = {
        ...result,
        notification_badge: find_user.notification_badge,
      };
    }

    return successRes(res, "App version updated successfully", result);
  }),
};
