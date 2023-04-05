const User = require("../../models/M_user");
const Follower_Following = require("../../models/M_followerFollowing");
const Notification = require("../../models/M_notification");

module.exports = {
  /* Add notification */
  sCreateNotification: (data) => {
    return new Promise(async (resolve, reject) => {
      var create_qry = new Notification({
        notification_title: data.notification_title,
        notification_message: data.notification_message,
        notification_type: data.notification_type,
        notification_for: data.notification_for,
        sender_user: data.sender_user,
        receiver_user: data.receiver_user,
        request_id: data.request_id,
        // is_accepted: true,
        notification_date: data.notification_date,
      });

      create_qry.save((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Notification list */
  sNotificationList: (data) => {
    return new Promise(async (resolve, reject) => {
      Notification.find(
        {
          receiver_user: data.login_user_id,
          is_deleted: false,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result || false);
        }
      )
        .populate({
          path: "sender_user",
          select: "user_name profile_picture profile_url",
        })
        .limit(data.limit * 1)
        .skip((data.page - 1) * data.limit)
        .sort({ notification_date: -1 });
    });
  },

  /* Reject request ( is_accept: false status) */
  sRejectRequest: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        is_accepted: false,
      };
      Follower_Following.findByIdAndUpdate(
        data,
        update_data,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* Accept request ( is_accept: true status ) */
  sAcceptRequest: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        is_accepted: true,
      };
      Follower_Following.findByIdAndUpdate(
        data,
        update_data,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* Reject request in notification ( is_accept: false status) */
  sRejectNotiUpdate: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        is_accepted: false,
        notification_for: "follow_request_reject",
      };
      Notification.findByIdAndUpdate(data, update_data, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Accept request in notification ( is_accept: true status ) */
  sNotificationUpdate: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        is_accepted: true,
        notification_for: "follow_request_accept",
        notification_message: "has started following you",
      };
      Notification.findByIdAndUpdate(data, update_data, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Add notification badge count in user model */
  sAddNotiBadge: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        $inc: {
          notification_badge: 1,
        },
      };
      User.findByIdAndUpdate(data, update_data, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Remove notification badge count in user model */
  sRemoveNotiBadge: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        notification_badge: 0,
      };
      User.findByIdAndUpdate(data, update_data, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* create follow user */
  sFollowUser: (data) => {
    return new Promise(async (resolve, reject) => {
      let query = {
        follower_id: data.follower_id,
        following_id: data.following_id,
      };
      var request = {
        $set: {
          follower_id: data.follower_id,
          following_id: data.following_id,
          is_deleted: false,
          // is_accepted: true,
          is_block: false,
        },
      };
      let options = { upsert: true, new: true };
      var result = await Follower_Following.updateOne(query, request, options);
      if (result) {
        return resolve(request.$set);
      } else {
        return reject(error);
      }
    });
  },

  /* find data of follower_following user */
  sFindFollowUserData: (data) => {
    return new Promise(async (resolve, reject) => {
      Follower_Following.findOne((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }).where({
        _id: data.request_id,
        follower_id: data.follower_id,
        following_id: data.following_id,
      });
    });
  },
};
