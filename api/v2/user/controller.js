const {
  sUserRegistration,
  sFindEmail,
  sFindMobileNo,
  sFindUserName,
  // sFindId,
  sSendOtp,
  sVerifyOtp,
  sChangePassword,
  sResetPwd,
  sUpdatePwdStatus,
  sLoginUser,
  sSocialLogin,
  sCreateSocialUser,
  sFindSessionData,
  sUpdateUserSessionData,
  sGetAllUser,
  sGetUserById,
  sAddQueAns,
  sMatchQueAns,
  sUpdate,
  sDelete,
} = require("./service");

const { sAppVersionCheck } = require("../appVersion/service");

const util = require("util");
const fs = require("fs");
// for thumbnail generate
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
var ffprobe = require("ffprobe-static");
ffmpeg.setFfprobePath(ffprobe.path);

const { JWT_KEY, APISTATUS, NODE_ENV } = require("../../constants/env");
const { userToken } = require("../../utils/commonFunctions/token");
const {
  sendOtpCode,
  sendPassword,
  sendMailForPwd,
  welcomeMail,
} = require("../../utils/commonFunctions/sendMail");
const {
  comparePassword,
  generatePassword,
} = require("../../utils/commonFunctions/securePassword");

const AppError = require("../../utils/ErrorHandlers/appError");
const catchAsync = require("../../utils/ErrorHandlers/catchAsync");
const deleteFile = require("../../utils/FileHandlers/deleteFile");
const { _FILE_CONFIG } = require("../../utils/FileHandlers/fileConfig");
const moveFile = require("../../utils/FileHandlers/moveFile");

const {
  successRes,
  errorRes,
} = require("../../utils/commonFunctions/commonFun");

module.exports = {
  /* Check Email is exist or not */
  cFindEmail: catchAsync(async (req, res, next) => {
    const data = req.body;
    const Results = await sFindEmail(data);
    if (Results) {
      throw new AppError("Email id already exists", APISTATUS.CONFLICT);
    } else {
      next();
    }
  }),

  /* Check Mobile Number is exist or not */
  cFindMobileNo: catchAsync(async (req, res, next) => {
    const data = req.body;
    const Results = await sFindMobileNo(data);
    if (Results) {
      throw new AppError("Mobile number already exists", APISTATUS.CONFLICT);
    } else {
      next();
    }
  }),

  /* Check user id is exist or not */
  cFindId: catchAsync(async (req, res, next) => {
    const data = req.user._id;
    const Results = await sGetUserById(data);
    if (Results) {
      next();
    } else {
      throw new AppError("User not found", APISTATUS.CONFLICT);
    }
  }),

  /* User Sign Up Api

    URL       : {{base_url}}/api/user/user_registration
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      user_name
      profile_picture
      email_address
      password
      mobile_number
      country_code
      user_type ( user, admin )
    }
  */
  cUserRegistration: catchAsync(async (req, res, next) => {
    const body = req.body;

    body.profile_picture = req?.file?.filename || "";

    var Result = await sUserRegistration(body);

    var token = await userToken(Result);

    Result = {
      ...Result._doc,
      token: token,
    };
    await sLoginUser(Result._id);

    body.profile_picture != "" &&
      moveFile(body.profile_picture, _FILE_CONFIG.USER_PROFILE_PIC.rootDir);

    var data = {
      user_name: Result.user_name,
      email_address: Result.email_address,
    };
    await welcomeMail(data);
    return successRes(
      res,
      `Your account has been successfully created`,
      Result
    );
  }),

  /* Email With Pwd Login
    URL       : {{base_url}}/api/user/user_login_with_emailPwd
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      email_address
      password
      device_type (ios, android)
      device_token
    }
  */
  cEmailPwdLogin: catchAsync(async (req, res, next) => {
    var body = req.body;
    const find_user = await sFindEmail(body);
    if (!find_user) {
      throw new AppError("No account found with this email", APISTATUS.OK);
    } else {
      const password_compare = await comparePassword(
        body.password,
        find_user.password
      );

      if (password_compare) {
        find_user.password = undefined;
        var token = await userToken(find_user);

        var user_data = {
          _id: find_user._id,
          user_name: find_user.user_name,
          email_address: find_user.email_address,
          mobile_number: find_user.mobile_number,
          // country_code: find_user.country_code,
          // is_email_verify: find_user.is_email_verify,
          is_block: find_user.is_block,
          token: token,
        };
        var session_data = await sFindSessionData(user_data._id);
        body = { ...body, session_data: session_data._id };
        await sUpdateUserSessionData(body);
        await sLoginUser(user_data._id);
        return successRes(res, `You have successfully login`, user_data);
      } else {
        throw new AppError(
          "Your password is wrong, please check it",
          APISTATUS.OK
        );
      }
    }
  }),

  /* User Name With Pwd Login

    URL       : {{base_url}}/api/user/user_login_with_uNamePwd
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      user_name
      password
      device_type (ios, android)
      device_token
    }
  */
  cUserNamePwdLogin: catchAsync(async (req, res, next) => {
    const body = req.body;

    const find_user = await sFindUserName(body);

    if (!find_user) {
      throw new AppError("No account found with this user name", APISTATUS.OK);
    } else {
      const password_compare = await comparePassword(
        body.password,
        find_user.password
      );

      if (password_compare) {
        find_user.password = undefined;
        var token = await userToken(find_user);

        var user_data = {
          _id: find_user._id,
          user_name: find_user.user_name,
          email_address: find_user.email_address,
          mobile_number: find_user.mobile_number,
          // country_code: find_user.country_code,
          // is_email_verify: find_user.is_email_verify,
          is_block: find_user.is_block,
          token: token,
        };
        var session_data = await sFindSessionData(user_data._id);
        body = { ...body, session_data: session_data._id };
        await sUpdateUserSessionData(body);
        await sLoginUser(user_data._id);

        return successRes(res, `You have successfully login`, user_data);
      } else {
        throw new AppError(
          "Your password is wrong, please check it",
          APISTATUS.OK
        );
      }
    }
  }),

  /* Mobile No With Pwd Login

    URL       : {{base_url}}/api/user/user_login_with_mobileNoPwd
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      mobile_number
      password
      device_type (ios, android)
      device_token
    }
  */
  cMobileNoPwdLogin: catchAsync(async (req, res, next) => {
    const body = req.body;

    const find_user = await sFindMobileNo(body);
    if (!find_user) {
      throw new AppError(
        "No account found with this mobile number",
        APISTATUS.OK
      );
    } else {
      const password_compare = await comparePassword(
        body.password,
        find_user.password
      );

      if (password_compare) {
        find_user.password = undefined;
        var token = await userToken(find_user);

        var user_data = {
          _id: find_user._id,
          user_name: find_user.user_name,
          email_address: find_user.email_address,
          mobile_number: find_user.mobile_number,
          // country_code: find_user.country_code,
          // is_email_verify: find_user.is_email_verify,
          is_block: find_user.is_block,
          token: token,
        };
        var session_data = await sFindSessionData(user_data._id);
        body = { ...body, session_data: session_data._id };
        await sUpdateUserSessionData(body);
        await sLoginUser(user_data._id);

        return successRes(res, `You have successfully login`, user_data);
      } else {
        throw new AppError(
          "Your password is wrong, please check it",
          APISTATUS.OK
        );
      }
    }
  }),

  /* Email With Otp Login

    URL       : {{base_url}}/api/user/user_login_with_emailOtp
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      email_address
      otp
      device_type (ios, android)
      device_token
    }
  */
  cEmailOtpLogin: catchAsync(async (req, res, next) => {
    const body = req.body;

    const find_user = await sFindEmail(body);
    if (!find_user) {
      throw new AppError("No account found with this email", APISTATUS.OK);
    }

    if (find_user.email_otp == body.otp) {
      var final_data = await sVerifyOtp(find_user);
      if (final_data) {
        var token = await userToken(find_user);
        var user_data = {
          _id: find_user._id,
          user_name: find_user.user_name,
          email_address: find_user.email_address,
          mobile_number: find_user.mobile_number,
          // country_code: find_user.country_code,
          // is_email_verify: find_user.is_email_verify,
          is_block: find_user.is_block,
          token: token,
        };
        var session_data = await sFindSessionData(user_data._id);
        body = { ...body, session_data: session_data._id };
        await sUpdateUserSessionData(body);
        await sLoginUser(user_data._id);

        return successRes(res, `You have successfully login`, user_data);
      }
    } else {
      return errorRes(res, `Please enter valid OTP`);
    }
  }),

  /* Mobile No With Otp Login

    URL       : {{base_url}}/api/user/user_login_with_mobileNoOtp
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      mobile_number
      otp
      device_type (ios, android)
      device_token
    }
  */
  cMobileNoOtpLogin: catchAsync(async (req, res, next) => {
    const body = req.body;

    const find_user = await sFindMobileNo(body);
    if (!find_user) {
      throw new AppError(
        "No account found with this mobile number",
        APISTATUS.OK
      );
    } else {
      var token = await userToken(find_user);

      var user_data = {
        _id: find_user._id,
        user_name: find_user.user_name,
        email_address: find_user.email_address,
        mobile_number: find_user.mobile_number,
        // country_code: find_user.country_code,
        // is_email_verify: find_user.is_email_verify,
        is_block: find_user.is_block,
        token: token,
      };
      var session_data = await sFindSessionData(user_data._id);
      body = { ...body, session_data: session_data._id };
      await sUpdateUserSessionData(body);
      await sLoginUser(user_data._id);

      return successRes(res, `You have successfully login`, user_data);
    }
  }),

  /* Social login

    URL       : {{base_url}}/api/user/social_login
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      is_social_login
      email_address
      device_type (ios, android)
      device_token
      social_id
      user_name
      profile_url
      social_platform (google, facebook, apple, null)
      app_version
    }
  */
  cSocialLogin: catchAsync(async (req, res, next) => {
    var body = req.body;
    var user_detail = [];

    if (body.is_social_login == "true") {
      var find_user = await sFindEmail(body);

      if (find_user) {
        if (find_user.is_block == true) {
          return errorRes(
            res,
            `This account is block, Please contact to administrator`
          );
        }
        if (
          find_user.social_platform != body.social_platform &&
          find_user.social_platform != null
        ) {
          return errorRes(
            res,
            "You already used this email. Please login with " +
              find_user.social_platform
          );
        }

        var token = await userToken(find_user);

        var user_data = {
          user_id: find_user._id,
          is_login: true,
          profile_url: body.profile_url,
          is_social_login: true,
          social_id: body.social_id,
          social_platform: body.social_platform,
        };

        // app version
        var session_data = await sFindSessionData(find_user._id);
        body = { ...body, session_data: session_data._id };
        await sUpdateUserSessionData(body);

        var updated_data = await sSocialLogin(user_data);
        user_detail = {
          user_name: updated_data.user_name,
          email_address: updated_data.email_address,
          is_social_login: updated_data.is_social_login,
          profile_url: updated_data.profile_url,
          social_id: updated_data.social_id,
          social_platform: updated_data.social_platform,
          // ...updated_data._doc,
          token: token,
        };

        find_user.token = token;
      } else {
        // create
        var check_user_email = await sFindEmail(body);

        if (check_user_email.length > 0) {
          return await errorRes(
            res,
            "Email already exist, you can try signing with another email"
          );
        } else {
          var create_user = await sCreateSocialUser(body);

          // app version
          body = { ...body, user_id: create_user._id };
          await sAppVersionCheck(body);

          // edit device token and device type
          var session_data = await sFindSessionData(create_user._id);
          body = { ...body, session_data: session_data._id };
          await sUpdateUserSessionData(body);

          if (create_user) {
            let token = await userToken(create_user);

            user_detail = {
              user_name: create_user.user_name,
              email_address: create_user.email_address,
              is_social_login: create_user.is_social_login,
              profile_url: create_user.profile_url,
              social_id: create_user.social_id,
              social_platform: create_user.social_platform,
              // ...create_user._doc,
              token: token,
            };
          }
        }
      }

      return successRes(res, `You have successfully login`, user_detail);
    }
  }),

  /* Send OTP Api ( forgot_pwd )

    URL       : {{base_url}}/api/user/send_otp
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      email_address
    }
  */
  cSendOtp: catchAsync(async (req, res, next) => {
    const body = req.body;

    const find_user = await sFindEmail(body);
    if (!find_user) {
      throw new AppError("No account found with this email", APISTATUS.OK);
    }

    const Result = await sSendOtp(find_user);
    var otp = Result.email_otp;
    var email_address = Result.email_address;
    let data = {
      otp,
      email_address,
    };

    await sendOtpCode(data);

    return successRes(
      res,
      `Successfully ! send verification code to your email`,
      data
    );
  }),

  /* OTP Verify Api ( forgot_pwd )

    URL       : {{base_url}}/api/user/verify_otp
    Created By: Vrushti Vekariya
    Date      : 24/02/2023
    Header    : Not required 
    parameters: {
      email_address
      otp
    }
  */
  cVerifyOtp: catchAsync(async (req, res, next) => {
    const body = req.body;
    const find_user = await sFindEmail(body.email_address);
    if (!find_user) {
      throw new AppError("No account found with this email", APISTATUS.OK);
    }

    if (find_user.email_otp == body.otp) {
      var final_data = await sVerifyOtp(find_user);
      if (final_data) {
        return successRes(res, `OTP verified successfully`);
      }
    } else {
      return errorRes(res, `Please enter valid OTP`);
    }
  }),

  /* Change Password Api 

    URL       : {{base_url}}/api/user/change_password
    Created By: Vrushti Vekariya
    Date      : 27/02/2023
    Header    : Required 
    parameters: {
      old_password
      new_password
    }
  */
  cChangePassword: catchAsync(async (req, res, next) => {
    var body = req.body;
    var user_id = req.user.id;

    body = { ...body, user_id: user_id };
    const profileData = await sGetById(user_id);
    if (!profileData) {
      throw new AppError(
        "This user has been not available",
        APISTATUS.NOT_FOUND
      );
    }

    const passwordCompare = await comparePassword(
      body.old_password,
      profileData.password
    );
    if (passwordCompare) {
      const Result = await sChangePassword(body);
      return successRes(
        res,
        "User password has been updated successfully",
        profileData,
        APISTATUS.OK
      );
    } else {
      throw new AppError("Current password is incorrect", APISTATUS.OK);
    }
  }),

  /* Reset Password Api 

    URL       : {{base_url}}/api/user/change_password
    Created By: Vrushti Vekariya
    Date      : 27/02/2023
    Header    : Not required 
    parameters: {
      email_address
      password
    }
  */
  cResetPassword: catchAsync(async (req, res, next) => {
    var body = req.body;

    body = { ...body, new_password: body.password };

    const getUser = await sFindEmail(body);
    if (!getUser) {
      throw new AppError(
        "This account has been not found",
        APISTATUS.NOT_FOUND
      );
    }

    body = { ...body, user_id: getUser._id };

    const Results = await sChangePassword(body);

    // send login credentials to user in mail

    // let hMailData = {
    //   email: getUser.email,
    //   password: generate_password,
    //   name: getUser.first_name + " " + getUser.last_name,
    // };

    // await sendPassword(hMailData);

    return successRes(res, "User password reset successfully");
  }),

  /* Send Password in Mail Api 

    URL       : {{base_url}}/api/user/send_pwd_in_mail
    Created By: Vrushti Vekariya
    Date      : 27/02/2023
    Header    : Not required 
    parameters: {
      email_address
    }
  */
  cSendPwdInMail: catchAsync(async (req, res, next) => {
    var body = req.body;

    // generate random password of 8 character, which contains (a-z,A-Z,0-9)

    let generate_password = await generatePassword();

    body = { ...body, new_password: generate_password };

    const getUser = await sFindEmail(body);
    if (!getUser) {
      throw new AppError(
        "This account has been not found",
        APISTATUS.NOT_FOUND
      );
    }

    body = { ...body, user_id: getUser._id };

    const Results = await sChangePassword(body);

    // send login credentials to user in mail

    let data = {
      email: getUser.email_address,
      password: generate_password,
    };

    await sendPassword(data);

    return successRes(
      res,
      "User password has been sent successfully into your mail"
    );
  }),

  /* Send Mail for reset password

    URL       : {{base_url}}/api/user/send_mail
    Created By: Vrushti Vekariya
    Date      : 28/02/2023
    Header    : Not required 
    parameters: {
      email_address
    }
  */
  cSetNewPwd: catchAsync(async (req, res, next) => {
    var body = req.body;

    const getUser = await sFindEmail(body);
    if (!getUser) {
      throw new AppError(
        "This account has been not found",
        APISTATUS.NOT_FOUND
      );
    }

    let data = {
      email: getUser.email_address,
      user_id: getUser._id,
    };

    await sendMailForPwd(data);

    await sUpdatePwdStatus(data);

    return successRes(
      res,
      "An email has been sent to your address with a reset password you can use to access your account."
    );
  }),

  /* Api call when Direct send to link in mail and open web page to set new password

    URL       : -
    Created By: Vrushti Vekariya
    Date      : 28/02/2023
    Header    : Not required 
    No parameters
  */
  cResetPwd: catchAsync(async (req, res, next) => {
    var body = req.body;
    var params = req.params.id;

    const getUser = await sGetUserById(params);

    body = { ...body, user_id: getUser._id };
    if (!getUser) {
      throw new AppError(
        "This account has been not found",
        APISTATUS.NOT_FOUND
      );
    } else {
      const reset_password = await sResetPwd(body);
      return successRes(res, "Password has been updated successfully");
    }
  }),

  /* All user list exclude login user

    URL       : {{base_url}}/api/user/user_list
    Created By: Vrushti Vekariya
    Date      : 28/02/2023
    Header    : Required 
    Parameters: {
      page
      limit
      search_data (optional)
    }
  */
  cGetAllUser: catchAsync(async (req, res, next) => {
    var login_user_id = req.user;
    var { page = 1, limit = 10 } = req.body;

    body = { page: page, limit: limit, login_user_id: login_user_id };

    if (req.body.search_data != undefined) {
      let search_data = req.body.search_data;

      search_data = search_data.trim();
      var search_val = {
        user_name: { $regex: search_data, $options: "i" },
      };
      body = {
        search_val,
        page: page,
        limit: limit,
        login_user_id: login_user_id,
      };
    }

    const Results = await sGetAllUser(body);

    return successRes(res, "User list get successfully", Results);
  }),

  /* Login User detail or User Id wise user detail

    URL       : {{base_url}}/api/user/login_user_detail
    Created By: Vrushti Vekariya
    Date      : 28/02/2023
    Header    : Required 
    No parameters
  */
  cGetUserById: catchAsync(async (req, res, next) => {
    var { user_id } = req.body;
    if (user_id) {
      var login_user_id = user_id;
    } else {
      var login_user_id = req.user._id;
    }

    const Results = await sGetUserById(login_user_id);

    return successRes(res, "User detail get successfully", Results);
  }),

  /* Add question's answer for forgot password

    URL       : {{base_url}}/api/user/add_que_ans
    Created By: Vrushti Vekariya
    Date      : 01/03/2023
    Header    : Required 
    Parameters: {
      fav_color
      fav_food
      fav_actor
    }
  */
  cAddQueAns: catchAsync(async (req, res, next) => {
    var body = req.body;
    body = { ...body, user_id: req.user._id };
    var Result = await sAddQueAns(body);

    return successRes(
      res,
      `Your question's answer has been saved successfully`,
      Result
    );
  }),

  /* Match security question's answer for forgot password

    URL       : {{base_url}}/api/user/match_que_ans
    Created By: Vrushti Vekariya
    Date      : 01/03/2023
    Header    : Required 
    Parameters: {
      fav_color
      fav_food
      fav_actor
    }
  */
  cMatchQueAns: catchAsync(async (req, res, next) => {
    var body = req.body;
    var user_id = req.user._id;

    body = { ...body, user_id };

    const Results = await sMatchQueAns(body);
    if (Results) {
      var match = true;
    } else {
      var match = false;
    }
    return successRes(res, "Your all question's answer is", match);
  }),

  /* Update user name and profile picture (user details)

    URL       : {{base_url}}/api/user/edit_user_detail
    Created By: Vrushti Vekariya
    Date      : 02/03/2023
    Header    : Required 
    Parameters: {
      user_name
      profile_picture
    }
  */
  cUpdate: catchAsync(async (req, res, next) => {
    var body = req.body;
    var login_user_id = req.user._id;
    var profile_picture = req.user.profile_picture;
    body.profile_picture = req?.file?.filename || "";

    body = { ...body, user_id: login_user_id };

    const updated_user = await sUpdate(body);

    if (body.profile_picture) {
      deleteFile("assets/images/profile_picture/" + profile_picture);

      body.profile_picture != "" &&
        moveFile(body.profile_picture, _FILE_CONFIG.USER_PROFILE_PIC.rootDir);
    }

    return successRes(res, "User updated successfully", updated_user);
  }),

  /* Delete user 

    URL       : {{base_url}}/api/user/delete_user
    Created By: Vrushti Vekariya
    Date      : 02/03/2023
    Header    : Required 
    No parameters
  */
  cDelete: catchAsync(async (req, res, next) => {
    var login_user_id = req.user._id;
    await sDelete(login_user_id);

    return successRes(res, "Successfully deleted user");
  }),

  /* Chat File Upload
    
    URL       : {{base_url}}/api/user/chat_file_upload
    Created By: Vrushti Vekariya
    Date      : 28-03-2023
    Header    : Not required 
    Parameters: {
      image_file
    }
   */
  cChatFileUpload: catchAsync(async (req, res, next) => {
    let { image_file } = req.files;

    let check_img = util.isArray(image_file);

    if (check_img == false) {
      var img_array = [];
      img_array.push(image_file);
    } else {
      var img_array = image_file;
    }

    if (img_array != undefined && img_array != "") {
      var image_array = [];
      for (var value of img_array) {
        var image = value;

        let file_extension = image.originalFilename
          .split(".")
          .pop()
          .toLowerCase();

        var filename =
          "image_" +
          Math.floor(1000 + Math.random() * 9000) +
          "_" +
          Date.now() +
          "." +
          file_extension;

        var file_type = "";

        if (
          file_extension == "jpeg" ||
          file_extension == "png" ||
          file_extension == "bmp" ||
          file_extension == "jpg"
        ) {
          file_type = "image";
          var files = {
            file_type: "image",
            file_name: `chat_files/${filename}`,
          };

          image_array.push(files);

          let oldPath = image.path;
          let newPath = "assets/images/chat_files/" + filename;

          await fs.readFile(oldPath, function (err, data) {
            if (err) {
              return errorRes(res, `Something went wrong`);
              // throw err;
            }
            // Write the file
            fs.writeFile(newPath, data, function (err) {
              if (err) {
                // throw err;
                return errorRes(res, `Something went wrong`);
              }
            });
          });
        }

        if (
          file_extension == "mp4" ||
          file_extension == "mov" ||
          file_extension == "wmv" ||
          file_extension == "avi" ||
          file_extension == "avchd" ||
          file_extension == "mkv"
        ) {
          let file_extension = image.originalFilename
            .split(".")
            .pop()
            .toLowerCase();
          var file_name =
            "video_" +
            Math.floor(1000 + Math.random() * 9000) +
            "_" +
            Date.now() +
            "." +
            file_extension;

          file_type = "video";

          var O_file_name =
            Math.floor(1000 + Math.random() * 9000) +
            "_" +
            image.originalFilename.split(".").slice(0, -1).join("."); // filename without extension

          var data = ffmpeg({ source: image.path })
            .on("end", () => {
              for (let i in image) {
                const uploadFile = () => {
                  filePath = "assets/images/chat_files/";
                  const params = {
                    Body: fs.createReadStream(filePath),
                    ContentType: "png",
                  };
                };
                uploadFile();
              }
            })
            .on("error", (err) => {
              console.log("Error", err);
            })
            .screenshots({
              count: 1,
              folder: "assets/images/chat_files/",
              filename: "thumb_" + O_file_name + ".png",
            });

          let oldPath = image.path;
          let newPath = "assets/images/chat_files/" + file_name;

          await fs.readFile(oldPath, function (err, data) {
            if (err) {
              return errorRes(res, `Something went wrong`);
              // throw err;
            }
            // Write the file
            fs.writeFile(newPath, data, function (err) {
              if (err) {
                // throw err;
                return errorRes(res, `Something went wrong`);
              }
            });
          });

          var files = {
            file_type: "video",
            file_name: `chat_files/${file_name}`,
            thumb_url: `chat_files/${"thumb_" + O_file_name + ".png"}`,
          };
          image_array.push(files);
        }
      }
    }

    return successRes(res, `File uploading successfully`, image_array);
  }),
};
