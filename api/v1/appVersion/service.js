const App_Version = require("../../models/M_appVersion");
const User_Session_Detail = require("../../models/M_userSessionDetail");

module.exports = {
  /* create app version data */
  sAddAppVersion: (data) => {
    return new Promise(async (resolve, reject) => {
      var create_qry = new App_Version({
        app_version: data.app_version,
        app_mode: data.app_mode,
        app_update_status: data.app_update_status,
        app_platform: data.app_platform,
        app_url: data.app_url,
        is_live: data.is_live,
      });
      create_qry.save((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  },

  /* app version check */
  sAppVersionCheck: (data) => {
    return new Promise(async (resolve, reject) => {
      var version_check = {
        app_version: data.app_version,
        user_id: data.user_id,
        device_type: data.device_type,
        device_token: data.device_token,
      };

      var check_version = await App_Version.findOne().where({
        app_version: data.app_version,
        is_live: false,
        app_platform: data.device_type,
        is_deleted: false,
      });

      if (data.user_id != null || data.user_id != undefined) {
        var query = {
          user_id: data.user_id,
        };
      } else {
        var query = {
          $and: [
            { device_type: data.device_type },
            { device_token: data.device_token },
          ],
        };
      }

      var request = {
        $set: data,
      };
      var options = { upsert: true, new: true };
      await User_Session_Detail.updateOne(query, request, options);

      var result = [];
      if (check_version) {
        if (check_version.app_version != data.app_version) {
          app_update_status = check_version.app_update_status;

          if (app_update_status == "is_force_update") {
            result = { ...result, is_need_update: true, is_force_update: true };
          } else {
            result = {
              ...result,
              is_need_update: true,
              is_force_update: false,
            };
          }
        } else {
          result = { ...result, is_need_update: false, is_force_update: false };
        }

        result["app_mode"] = check_version.app_mode;
      } else {
        let check_version = await App_Version.findOne().where({
          is_live: true,
          app_platform: data.device_type,
          is_deleted: false,
        });

        app_update_status = check_version.app_update_status;

        if (app_update_status == "is_force_update") {
          result = { ...result, is_need_update: true, is_force_update: true };
        } else {
          result = { ...result, is_need_update: true, is_force_update: false };
        }
        result["app_mode"] = check_version.app_mode;
      }
      if (result) {
        return resolve(result);
      } else {
        return reject(error);
      }
    });
  },
};
