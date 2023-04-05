const axios = require("axios");
const { SERVER_KEY } = require("../../constants/env");

/* Send notification in single device */
const notificationSend = async (data) => {
  const {
    device_token,
    notification_title,
    notification_message,
    notification_for,
    notification_type,
    id,
    notification_image,
    // details,
  } = data;

  let messageBody = {
    title: notification_title,
    message: notification_message,
    notification_for: notification_for,
    notification_type: notification_type,
    id: id,
  };

  // if (details != undefined) {
  //   messageBody = { ...messageBody, details: details };
  // }

  let notification_payload = {
    title: notification_title,
    body: notification_message,
  };

  if (notification_image != undefined) {
    notification_payload = {
      ...notification_payload,
      image: notification_image,
    };
  }

  // image:
  //     "https://i.picsum.photos/id/528/200/300.jpg?hmac=nQ5klrDwddW0du03zqKfOpyHkFBDaspI729AfK_FXPY",

  const serverKey = SERVER_KEY;
  const payload = {
    notification: notification_payload,
    data: messageBody,
    to: device_token,
  };
  let response = await axios.post(
    "https://fcm.googleapis.com/fcm/send",
    payload,
    {
      headers: {
        Authorization: `Bearer ${serverKey}`,
      },
    }
  );
  return response;
};

/* Send notification in multiple device */
const notiSendMultipleDevice = async (data) => {
  const {
    device_token,
    notification_title,
    notification_message,
    notification_for,
    id,
    notification_image,
    details,
  } = data;

  let messageBody = {
    title: notification_title,
    message: notification_message,
    notification_for: notification_for,
    id: id,
  };

  if (details != undefined) {
    messageBody = { ...messageBody, details: details };
  }

  let notification_payload = {
    title: notification_title,
    body: notification_message,
  };

  if (notification_image != undefined) {
    notification_payload = {
      ...notification_payload,
      image: notification_image,
    };
  }

  const serverKey = SERVER_KEY;
  const payload = {
    notification: notification_payload,
    data: messageBody,
    registration_ids: device_token,
  };

  let response = await axios.post(
    "https://fcm.googleapis.com/fcm/send",
    payload,
    {
      headers: {
        Authorization: `Bearer ${serverKey}`,
      },
    }
  );
  return response;
};

module.exports = { notificationSend, notiSendMultipleDevice };
