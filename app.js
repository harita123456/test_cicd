require("dotenv").config();
require("./config/database");
const express = require("express");
const app = express();
// for http server
const http = require("http");
const server = http.createServer(app);

// for https url with applying ssl
// const https = require("https");
// const server = https.createServer(
//   {
//     key: fs.readFileSync("key.pem"),
//     cert: fs.readFileSync("crt.pem"),
//   },
//   app
// );

global.socketio = require("socket.io")(server);
require("./socket")(socketio);

const logger = require("./config/logger");
const AppError = require("./utils/ErrorHandlers/appError");
const errorController = require("./utils/ErrorHandlers/errorController");
const path = require("path");
const cron = require("node-cron");
var cors = require("cors");

const User = require("./models/M_user");

const { APP_PORT } = require("./constants/env");
const { dateTime } = require("./utils/commonFunctions/dateTime");

const {
  notiSendMultipleDevice,
} = require("./utils/commonFunctions/notificationSend");
const { cResetPwd } = require("./api/user/controller");
const {
  sFindIdForResetStatus,
  sFindAllSessionData,
} = require("./api/user/service");
const {
  sCreateNotification,
  sAddNotiBadge,
} = require("./api/notification/service");

// Define Routes
const appVersionRouter = require("./api/appVersion/router");
const userRouter = require("./api/user/router");
const notificationRouter = require("./api/notification/router");

// Create local variable
const port = APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// configuration of cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Allow public access
app.use("/assets", express.static("assets"));
// app.use("/assets", express.static(path.join("./assets")));

// Set EJS as templating engine
app.set("view engine", "ejs");

// for email web page link open for change password
app.get("/reset_password/:id", async (req, res) => {
  const _id = req.params.id;

  const getUser = await sFindIdForResetStatus(_id);
  if (getUser) {
    res.render("already_use_message");
  } else {
    var update_data = {
      is_reset_req: true,
    };
    var find_user = User.findByIdAndUpdate(
      { _id: _id },
      update_data,
      function (err, data) {
        if (data) {
          res.render("reset_password", { user: data });
        } else {
          res.send(err);
        }
      }
    );
  }
});

app.post("/reset_pwd/:id", cResetPwd);

app.get("/success", (req, res) => {
  res.render("success_message");
});

// Define request type and set request response logger
app.use(express.json());
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    logger.info(JSON.parse(data));
    // eslint-disable-next-line prefer-rest-params
    oldSend.apply(res, arguments);
  };
  next();
});

// Api router
app.use("/api/app_version/", appVersionRouter);
app.use("/api/user/", userRouter);
app.use("/api/notification/", notificationRouter);

// Url not found
app.all("*", (req, res, next) => {
  throw new AppError(`Requested URL ${req.path} not found!`, 404);
});

// Control your error middleware
app.use(errorController);

// Cron job for multiple notification  ( every morning  At 09:00 o'clock )
cron.schedule("0 9 * * *", async () => {
  const currentDateTime = await dateTime();
  var find_session_data = await sFindAllSessionData();

  var find_Device_token = await Promise.all(
    find_session_data.map(async (data) => {
      return data.device_token;
    })
  );
  var find_receiver_id = await Promise.all(
    find_session_data.map(async (data) => {
      await sAddNotiBadge(data.user_id);
      return data.user_id;
    })
  );
  var notification_message = "Good Morning... ";

  let notification_title = "Greeting message";
  let notification_for = "greeting_msg";
  let notification_type = "general";

  let notiData = {
    notification_message,
    notification_title,
    notification_for,
    notification_type,
  };

  var notification_data = {
    notification_message,
    notification_title,
    notification_for,
    notification_type,
    sender_user: "64006647df53af409492d17f",
    receiver_user: find_receiver_id,
    notification_date: currentDateTime,
  };
  await sCreateNotification(notification_data);

  if (find_Device_token != null) {
    notiData = { ...notiData, device_token: find_Device_token };
    await notiSendMultipleDevice(notiData);
  }
});

// port number
server.listen(port, () => {
  console.log(`Server app listening on port : ${port}`);
});
