const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const { _FILE_CONFIG } = require("../../utils/FileHandlers/FileConfig");
const { mCheckToken } = require("../../auth/tokenValidation");

const {
  cFindEmail,
  cFindMobileNo,
  cUserRegistration,
  // cLogin,
  cEmailPwdLogin,
  cUserNamePwdLogin,
  cMobileNoPwdLogin,
  cEmailOtpLogin,
  cMobileNoOtpLogin,
  cSocialLogin,
  cSendOtp,
  cVerifyOtp,
  cChangePassword,
  cResetPassword,
  cSendPwdInMail,
  cSetNewPwd,
  cGetAllUser,
  cGetUserById,
  cAddQueAns,
  cMatchQueAns,
  cFindId,
  cUpdate,
  cDelete,
  cChatFileUpload,
} = require("./controller");

const {
  mUserRegistration,
  mLoginUserValidation,
  mChangePassword,
  mResetPassword,
} = require("../../validation/user/validation");

const storage = multer.diskStorage({
  destination: _FILE_CONFIG.TEMP.projectDir,
  filename: (Req, File, Cb) => {
    return Cb(
      null,
      `${_FILE_CONFIG.USER_PROFILE_PIC.filePrefix}${Date.now()}${path.extname(
        File.originalname
      )}`
    );
  },
});
// set multer
const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1,
  // },
});

router.post(
  "/user_registration",
  upload.single("profile_picture"),
  mUserRegistration,
  cFindEmail,
  cFindMobileNo,
  cUserRegistration
);

/* router.post(
  "/user_login",
  multipartMiddleware,
  mLoginUserValidation,
  cFindEmail,
  cLogin
); */

router.post(
  "/user_login_with_emailPwd",
  multipartMiddleware,
  mLoginUserValidation,
  cEmailPwdLogin
);
router.post(
  "/user_login_with_uNamePwd",
  multipartMiddleware,
  mLoginUserValidation,
  cUserNamePwdLogin
);
router.post(
  "/user_login_with_mobileNoPwd",
  multipartMiddleware,
  mLoginUserValidation,
  cMobileNoPwdLogin
);
router.post(
  "/user_login_with_emailOtp",
  multipartMiddleware,
  mLoginUserValidation,
  cEmailOtpLogin
);
router.post(
  "/user_login_with_mobileNoOtp",
  multipartMiddleware,
  mLoginUserValidation,
  cMobileNoOtpLogin
);
router.post(
  "/user_social_login",
  multipartMiddleware,
  mLoginUserValidation,
  cSocialLogin
);

router.post(
  "/change_password",
  multipartMiddleware,
  mCheckToken,
  mChangePassword,
  cChangePassword
);
router.post(
  "/reset_password",
  multipartMiddleware,
  mResetPassword,
  cResetPassword
);
router.post("/send_pwd_in_mail", multipartMiddleware, cSendPwdInMail);
router.post("/send_mail", multipartMiddleware, cSetNewPwd);

router.post("/send_otp", multipartMiddleware, cSendOtp);

router.post("/verify_otp", multipartMiddleware, cVerifyOtp);

router.post("/user_list", multipartMiddleware, mCheckToken, cGetAllUser);
router.post(
  "/login_user_detail",
  multipartMiddleware,
  mCheckToken,
  cGetUserById
);

// for forgot pwd using que ans
router.post("/add_que_ans", multipartMiddleware, mCheckToken, cAddQueAns);
router.post(
  "/match_que_ans",
  multipartMiddleware,
  mCheckToken,
  cFindId,
  cMatchQueAns
);

router.post(
  "/edit_user_detail",
  mCheckToken,
  upload.single("profile_picture"),
  cUpdate
);
router.post("/delete_user", mCheckToken, cDelete);

router.post("/chat_file_upload", multipartMiddleware, cChatFileUpload);

module.exports = router;
