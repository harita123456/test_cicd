const User = require("../../models/M_user");
const Que_Ans = require("../../models/M_securityQueAns");
const User_Session_Detail = require("../../models/M_userSessionDetail");

const {
  encryptPassword,
} = require("../../utils/commonFunctions/securePassword");

module.exports = {
  /* Register user */
  sUserRegistration: (data) => {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await encryptPassword(data.password);

      var create_qry = new User({
        user_name: data.user_name,
        profile_picture: data.profile_picture,
        email_address: data.email_address,
        mobile_number: data.mobile_number,
        country_code: data.country_code,
        password: hashedPassword,
      });

      create_qry.save((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Find email id  from user model exist or not */
  sFindEmail: (data) => {
    return new Promise((resolve, reject) => {
      let email_address = data.email_address;

      User.findOne(
        { email_address: email_address, is_deleted: false },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result?._doc || false);
        }
      );
    });
  },

  /* Find mobile number from user model exist or not */
  sFindMobileNo: (data) => {
    return new Promise((resolve, reject) => {
      let mobile_number = data.mobile_number;

      User.findOne(
        { mobile_number: mobile_number, is_deleted: false },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result?._doc || false);
        }
      );
    });
  },

  /* Find user name from user model exist or not */
  sFindUserName: (data) => {
    return new Promise((resolve, reject) => {
      let user_name = data.user_name;
      User.findOne(
        { user_name: user_name, is_deleted: false },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result?._doc || false);
        }
      );
    });
  },

  /* Send 4 digit OTP */
  sSendOtp: (data) => {
    return new Promise(async (resolve, reject) => {
      let otp = Math.floor(1000 + Math.random() * 9000);
      let update_data = {
        email_otp: otp,
      };
      User.findByIdAndUpdate(
        data._id,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* Verify OTP */
  sVerifyOtp: (data) => {
    return new Promise(async (resolve, reject) => {
      let update_data = {
        email_otp: null,
      };
      User.findByIdAndUpdate(
        data._id,
        update_data,
        {
          new: true,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* change password or forgot password */
  sChangePassword: (data) => {
    return new Promise(async (resolve, reject) => {
      var password = await encryptPassword(data.new_password);
      let update_data = { password: password };

      User.findByIdAndUpdate(
        data.user_id,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* use for update is_login true in user's table */
  sLoginUser: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        is_login: true,
      };
      User.findByIdAndUpdate(
        data._id,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* Social login ( update data ) */
  sSocialLogin: (data) => {
    return new Promise(async (resolve, reject) => {
      let update_data = {
        is_login: true,
        profile_url: data.profile_url,
        is_social_login: true,
        social_id: data.social_id,
        social_platform: data.social_platform,
        is_login: true,
      };
      User.findByIdAndUpdate(
        data.user_id,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* Social login ( create new user ) */
  sCreateSocialUser: (data) => {
    return new Promise(async (resolve, reject) => {
      var create_qry = new User({
        is_social_login: true,
        profile_url: data.profile_url,
        email_address: data.email_address,
        social_id: data.social_id,
        user_name: data.user_name,
        social_platform: data.social_platform,
        is_login: true,
      });

      create_qry.save((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Find id wise data from user session detail model */
  sFindSessionData: (data) => {
    return new Promise(async (resolve, reject) => {
      User_Session_Detail.findOne({ user_id: data._id }, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Find all user data from session detail modal */
  sFindAllSessionData: (data) => {
    return new Promise(async (resolve, reject) => {
      User_Session_Detail.find({ is_deleted: false }, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* For update device token and device type  */
  sUpdateUserSessionData: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        device_token: data.device_token,
        device_type: data.device_type,
      };

      User_Session_Detail.findByIdAndUpdate(
        data.session_data,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* reset password ( Direct send to link in mail and open web page to set new password ) */
  sResetPwd: (data) => {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await encryptPassword(data.password);

      var update_data = {
        password: hashedPassword,
      };

      User.findByIdAndUpdate(
        data.user_id,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* update status when send mail ( Direct send to link in mail and open web page to set new password )  */
  sUpdatePwdStatus: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        is_reset_req: false,
      };

      User.findByIdAndUpdate(
        data.user_id,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* update status when click on click here link ( Direct send to link in mail and open web page to set new password )  */
  sFindIdForResetStatus: (data) => {
    return new Promise((resolve, reject) => {
      let _id = data;
      User.findOne(
        { _id: _id, is_deleted: false, is_reset_req: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result?._doc || false);
        }
      );
    });
  },

  /* Get all users list exclude login user */
  sGetAllUser: (data) => {
    return new Promise((resolve, reject) => {
      var login_user_id = data.login_user_id._id;

      if (data.search_val) {
        var search_data = data.search_val;
      } else {
        var search_data = null;
      }
      var where_query = { _id: { $ne: login_user_id }, is_deleted: false };

      User.find(search_data, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result || false);
      })
        .where(where_query)
        .select(
          "user_name profile_picture email_address country_code mobile_number"
        )
        .limit(data.limit * 1)
        .skip((data.page - 1) * data.limit)
        .sort({ createdAt: -1 });
    });
  },

  /* Find user by id */
  sGetUserById: (data) => {
    return new Promise((resolve, reject) => {
      User.findById({ _id: data, is_deleted: false }, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result || false);
      }).select(
        "user_name profile_picture email_address country_code mobile_number notification_badge"
      );
    });
  },

  /* Add question answer for forgot pwd */
  sAddQueAns: (data) => {
    return new Promise(async (resolve, reject) => {
      var create_qry = new Que_Ans({
        user_id: data.user_id,
        fav_color: data.fav_color,
        fav_food: data.fav_food,
        fav_actor: data.fav_actor,
      });

      create_qry.save((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* Match question answer */
  sMatchQueAns: (data) => {
    return new Promise(async (resolve, reject) => {
      /* {
        $or: [
          { fav_color: { $regex: /[a-zA-Z]/, $options: "i" } },
          { fav_food: { $regex: /[a-zA-Z]/, $options: "i" } },
          { fav_actor: { $regex: data.fav_actor, $options: "i" } },
        ],
      } */

      var where_query = {
        user_id: data.user_id,
      };
      Que_Ans.findOne(
        {
          $and: [
            { fav_color: { $regex: `^${data.fav_color}$`, $options: "i" } },
            { fav_food: { $regex: `^${data.fav_food}$`, $options: "i" } },
            { fav_actor: { $regex: `^${data.fav_actor}$`, $options: "i" } },
          ],
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result || false);
        }
      ).where(where_query);
    });
  },

  /* Update user detail ( user_name, profile_picture) */
  sUpdate: (data) => {
    return new Promise(async (resolve, reject) => {
      var update_data = {
        user_name: data.user_name,
        profile_picture: data.profile_picture,
      };
      User.findByIdAndUpdate(
        data.user_id,
        update_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  /* Delete user */
  sDelete: (data) => {
    return new Promise(async (resolve, reject) => {
      var updated_data = {
        is_deleted: true,
      };
      User.findByIdAndUpdate(
        data._id,
        updated_data,
        { new: true },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },
};
