const {
  sCreateNotification,
  sNotificationList,
  sNotificationUpdate,
  sAcceptRequest,
  sRejectNotiUpdate,
  sRejectRequest,
  sAddNotiBadge,
  sRemoveNotiBadge,
  sFollowUser,
  sFindFollowUserData,
} = require("./service");
const { sGetUserById, sFindSessionData } = require("../user/service");

const { dateTime } = require("../../utils/commonFunctions/dateTime");
const {
  notificationSend,
} = require("../../utils/commonFunctions/notificationSend");

const { APISTATUS, IMAGE_PATH } = require("../../constants/env");

const AppError = require("../../utils/ErrorHandlers/appError");
const catchAsync = require("../../utils/ErrorHandlers/catchAsync");

const {
  successRes,
  errorRes,
} = require("../../utils/commonFunctions/commonFun");

module.exports = {
  /* Follow user (request to user) Api

    URL       : {{base_url}}/api/notification/follow_user
    Created By: Vrushti Vekariya
    Date      : 02/03/2023
    Header    : Required 
    parameters: {
      following_id
    }
  */
  cFollowUser: catchAsync(async (req, res, next) => {
    var follower_id = req.user._id;
    var login_user_name = req.user.user_name;
    var login_user_profile_picture = req.user.profile_picture;

    var body = req.body;
    body = { following_id: body.following_id, follower_id: follower_id };
    const currentDateTime = await dateTime();

    var find_follower_data = await sGetUserById(follower_id);
    if (!find_follower_data) {
      throw new AppError("Follower user not found", APISTATUS.CONFLICT);
    }

    var find_following_data = await sGetUserById(body.following_id);
    var find_device_token = await sFindSessionData(find_following_data._id); // for find device token
    if (!find_following_data) {
      throw new AppError("Following user not found", APISTATUS.CONFLICT);
    }

    var Result = await sFollowUser(body);
    var final_data = await sFindFollowUserData(Result);
    if (Result) {
      let notification_message =
        login_user_name + " has requested to follow you";

      let notification_title = "Following you";
      let notification_for = "follow_request";
      let notification_type = "general";
      let notification_image = IMAGE_PATH + login_user_profile_picture;

      let notiData = {
        notification_image,
        notification_message,
        notification_title,
        notification_for,
        notification_type,
        id: follower_id,
      };

      var notification_data = {
        notification_message,
        notification_title,
        notification_for,
        notification_type,
        sender_user: follower_id,
        receiver_user: body.following_id,
        notification_date: currentDateTime,
        request_id: final_data._id,
      };

      await sCreateNotification(notification_data);
      var device_token = find_device_token.device_token;

      if (device_token != null) {
        notiData = { ...notiData, device_token: device_token };
        var noti_send = await notificationSend(notiData);
        if (noti_send.status == 200) {
          await sAddNotiBadge(find_following_data._id);
        }
      }
    }
    return successRes(res, "Following successfully", final_data);
  }),

  /* Accept follow request Api

    URL       : {{base_url}}/api/notification/accept_request
    Created By: Vrushti Vekariya
    Date      : 03/03/2023
    Header    : Required 
    parameters: {
      follower_id
      following_id
      request_id
      notification_id
    }
  */
  cAcceptRequest: catchAsync(async (req, res, next) => {
    var body = req.body;

    const currentDateTime = await dateTime();

    var find_follower_data = await sGetUserById(body.follower_id);
    if (!find_follower_data) {
      throw new AppError("Follower user not found", APISTATUS.CONFLICT);
    }

    var find_following_data = await sGetUserById(body.following_id);
    var find_device_token = await sFindSessionData(find_following_data._id); // for find device token
    if (!find_following_data) {
      throw new AppError("Following user not found", APISTATUS.CONFLICT);
    }

    var find_data = await sFindFollowUserData(body);
    if (!find_data) {
      throw new AppError("Couldn't found follow request", APISTATUS.CONFLICT);
    }

    await sAcceptRequest(body.request_id);
    await sNotificationUpdate(body.notification_id);

    // send notification

    let notification_message =
      find_follower_data.user_name + " has accepted your follow request";

    let notification_title = "Follow Request Accept";
    let notification_for = "follow_request_accept";
    let notification_type = "general";
    let notification_image = IMAGE_PATH + find_follower_data.profile_picture;

    let notiData = {
      notification_image,
      notification_message,
      notification_title,
      notification_for,
      notification_type,
      id: find_data._id,
    };

    var notification_data = {
      notification_message,
      notification_title,
      notification_for,
      notification_type,
      sender_user: body.follower_id,
      receiver_user: body.following_id,
      notification_date: currentDateTime,
      request_id: find_data._id,
    };

    await sCreateNotification(notification_data);
    var device_token = find_device_token.device_token;

    if (device_token != null) {
      notiData = { ...notiData, device_token: device_token };
      var noti_send = await notificationSend(notiData);
      if (noti_send.status == 200) {
        await sAddNotiBadge(find_following_data._id);
      }
    }

    return successRes(res, "Request accepted successfully");
  }),

  /* Reject follow request Api

    URL       : {{base_url}}/api/notification/reject_request
    Created By: Vrushti Vekariya
    Date      : 03/03/2023
    Header    : Required 
    parameters: {
      request_id
      notification_id
    }
  */
  cRejectRequest: catchAsync(async (req, res, next) => {
    var body = req.body;
    await sRejectRequest(body.request_id);
    await sRejectNotiUpdate(body.notification_id);

    return successRes(res, "Request rejected successfully");
  }),

  /* Notification List

    URL       : {{base_url}}/api/notification/notification_list
    Created By: Vrushti Vekariya
    Date      : 03/03/2023
    Header    : Required 
    parameters: {
      page
      limit
    }
  */
  cNotificationList: catchAsync(async (req, res, next) => {
    var login_user_id = req.user._id;
    var { page = 1, limit = 10 } = req.body;

    data = { login_user_id: login_user_id, page: page, limit: limit };
    var Result = await sNotificationList(data);

    await sRemoveNotiBadge(login_user_id);

    return successRes(res, "Notification list get successfully", Result);
  }),
};
