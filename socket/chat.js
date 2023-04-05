const Chat_Room = require("../models/M_chat_rooms.js");
const Chat = require("./../models/M_chat");
const User = require("./../models/M_user");
const {
  notificationSend,
} = require("./../utils/commonFunctions/notificationSend");

const { dateTime } = require("./../utils/commonFunctions/dateTime");

const { sFindSessionData } = require("./../api/user/service");

module.exports = {
  createRoom: async (data) => {
    let { user_id, other_user_id } = data;
    // console.log("data===========", data);

    let room_code = Math.floor(100000 + Math.random() * 900000);

    var cond1 = {
      user_id: user_id,
      other_user_id: other_user_id,
    };
    var cond2 = {
      user_id: other_user_id,
      other_user_id: user_id,
    };

    var createData = {
      user_id: user_id,
      other_user_id: other_user_id,
      room_code: room_code,
    };

    // console.log("createRoom === >>> ", createData);
    let findRoomFirst = await Chat_Room.findOne(cond1);

    let findRoomSecond = await Chat_Room.findOne(cond2);

    let findRoom = findRoomFirst ? findRoomFirst : findRoomSecond;

    if (findRoom) {
      // console.log(findRoom);
      return findRoom._id;
    } else {
      let createNewRoom = await Chat_Room.create(createData);

      // console.log(createNewRoom);
      return createNewRoom._id;
    }
  },

  chatUserList: async (data) => {
    var { user_id } = data;

    var match_condition = {
      $or: [{ user_id: user_id }, { other_user_id: user_id }],
      is_deleted: false,
    };

    var findRoom = await Chat_Room.find(match_condition).select(
      "user_id other_user_id room_code is_deleted"
    );

    var UserList = await Promise.all(
      findRoom.map(async (value) => {
        var result = { ...value._doc };

        let findLastMsg = await Chat.findOne()
          .where({
            chat_room_id: value._id,
            is_delete_by: { $ne: user_id },
          })
          .sort({ created_at: -1 });

        let unreadMessage = await Chat.find()
          .where({
            chat_room_id: value._id,
            is_delete_by: { $ne: user_id },
            receiver_id: user_id,
            is_read: false,
          })
          .count();

        if (findLastMsg) {
          if (findLastMsg.message_type == "text") {
            var last_message = findLastMsg.message;
          } else {
            var last_message = "media";
          }
          var last_message_time = findLastMsg.message_time;
        } else {
          var last_message = null;
          var last_message_time = null;
        }

        if (value.user_id == user_id) {
          var other_user = value.other_user_id;
        } else {
          var other_user = value.user_id;
        }

        let findOtherUser = await User.findById(other_user).select(
          "user_id user_name profile_picture"
        );

        if (findOtherUser) {
          result = {
            ...result,
            user_name: findOtherUser.user_name,
            profile_picture: findOtherUser.profile_picture,
          };
        }

        result = {
          ...result,
          last_message,
          last_message_time,
          unread_message: unreadMessage,
        };

        return result;
      })
    );

    // date wise sorting
    await UserList.sort(function (a, b) {
      return new Date(b.last_message_time) - new Date(a.last_message_time);
    });

    return UserList;
  },

  sendMessage: async (data) => {
    let {
      chat_room_id,
      sender_id,
      receiver_id,
      message,
      message_type,
      image_file,
    } = data;

    // console.log("sendMessage data ==> ", data);
    // console.log("==============================");

    let currentDateTime = await dateTime();

    let insertData = {
      chat_room_id: chat_room_id,
      sender_id: sender_id,
      receiver_id: receiver_id,
      message_time: currentDateTime,
      message: message,
      message_type: message_type,
    };

    if (image_file) {
      insertData = {
        ...insertData,
        media_file: image_file,
      };
    }

    let addMessage = await Chat.create(insertData);

    // work start from here
    let getMessage = await Chat.findById(addMessage._id);

    // Send Notification
    let get_receiver_user = await User.findById(receiver_id).where({
      is_deleted: false,
    });
    let get_sender_user = await User.findById(sender_id);

    if (get_receiver_user) {
      let name = "";
      var img = "";

      if (get_sender_user != null) {
        name = get_sender_user.user_name;
        img = get_sender_user.profile_picture;
      }

      let messageTemp = message;
      let notiData = {
        noti_msg: messageTemp,
        noti_title: name,
        noti_type: "chat_noti",
        noti_for: "message",
        id: sender_id,
        noti_image: img,
      };

      // console.log("send_msg notiData =============", notiData);
      var find_device_token = await sFindSessionData(get_sender_user._id);
      if (find_device_token) {
        var device_token = find_device_token.device_token;
        if (device_token != null) {
          notiData = { ...notiData, device_token: device_token };
          var noti_send = await notificationSend(notiData);
        }
      }
    }

    return getMessage;
  },

  getAllMessage: async (data) => {
    let { chat_room_id, user_id, page = 1, limit = 10 } = data;

    // console.log("getAllMessage ==> ", data);

    var findAllMessage = await Chat.find({
      chat_room_id: chat_room_id,
    })
      .where({
        is_delete_by: { $ne: user_id },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    // console.log("findAllMessage", findAllMessage);

    await Chat.updateMany(
      { chat_room_id: chat_room_id, receiver_id: user_id },
      { $set: { is_read: true } }
    );

    return findAllMessage;
  },

  deleteChat: async (data) => {
    let { chat_room_id, user_id } = data;
    // console.log("deleteChat ==> ", data);

    let deleteChatData = await Chat.find({ chat_room_id: chat_room_id });
    if (deleteChatData) {
      var delete_data = { is_delete_by: user_id };

      await Chat.updateMany(
        { chat_room_id: chat_room_id },
        { $push: delete_data }
      ).where({ is_delete_by: { $ne: user_id } });
    }
    let result = { id_deleted: true };

    return result;
  },

  deleteOneChat: async (data) => {
    let { chat_id, user_id } = data;

    // console.log("data ========", data);
    let deleteAllsChats = await Chat.find({ _id: chat_id });
    if (deleteAllsChats) {
      var delete_data = { is_delete_by: user_id };

      await Chat.updateOne({ _id: chat_id }, { $push: delete_data });
    }
  },

  unreadMessageUpdate: async (data) => {
    let { chat_room_id, user_id } = data;

    let chatUpdate = await Chat.updateMany(
      { chat_room_id: chat_room_id, receiver_id: user_id },
      { $set: { is_read: true } },
      { new: true }
    );
  },
};
