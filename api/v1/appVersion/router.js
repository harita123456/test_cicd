const router = require("express").Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const { cAddAppVersion, cAppVersionCheck } = require("./controller");

const {
  mAddAppVersion,
  mAppVersionCheck,
} = require("../../validation/appVersion/validation");

router.post(
  "/add_app_version",
  multipartMiddleware,
  mAddAppVersion,
  cAddAppVersion
);
router.post(
  "/check_app_version",
  multipartMiddleware,
  mAppVersionCheck,
  cAppVersionCheck
);

module.exports = router;
