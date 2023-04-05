const router = require("express").Router();

const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const { mCheckToken } = require("../../auth/tokenValidation");

const {
  cFollowUser,
  cAcceptRequest,
  cRejectRequest,
  cNotificationList,
} = require("./controller");

router.post("/follow_user", multipartMiddleware, mCheckToken, cFollowUser);
router.post(
  "/accept_request",
  multipartMiddleware,
  mCheckToken,
  cAcceptRequest
);
router.post(
  "/reject_request",
  multipartMiddleware,
  mCheckToken,
  cRejectRequest
);
router.post(
  "/notification_list",
  multipartMiddleware,
  mCheckToken,
  cNotificationList
);

module.exports = router;
