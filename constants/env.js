const APP_PORT = "2002";
const MONGODB_DATABASE_URL = "mongodb://localhost:27017/Common_Structure_Mongo";
const NODE_ENV = "dev"; // "dev" => Developer  "prod" => Production
const IS_LOCAL = true;
const JWT_KEY = "-ow96r#4eb9adret9ph7dr5f#StetreD";
const IMAGE_PATH = "http://192.168.29.127:2002/assets/images/profile_picture/";

// MAIL CONFIGURATION
const MAIL_PORT = 587;
const MAIL_USER = "_mainaccount@weappdeveloper.com";
const MAIL_PASSWORD = "Hardik@7484";
const MAIL_FROM_ADDRESS = "support@weappdeveloper.com";

// FIREBASE KEY FOR NOTIFICATION
const SERVER_KEY =
  "AAAAFdwY2YA:APA91bGOa2wt3mWfBnnTss3WxgKpFaQxB6NGqMGF3VKU1N-JzYFeIxqx-TvF3OVvEdw879BKFeWt0OshhuOIZwruFHFYYct_97Xi_BBGIEiqbOBaSc8T1MBkSU4yo8V2-kqs6OOtIQMv";

const APISTATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 401,
  PERMISSION_DENIED: 403,
  NOT_FOUND: 404,
  REQUIRED: 428,
  SERVICE_UNAVAILABLE: 503,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
};

module.exports = {
  APP_PORT,
  MONGODB_DATABASE_URL,
  APISTATUS,
  NODE_ENV,
  IS_LOCAL,
  JWT_KEY,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
  IMAGE_PATH,
  SERVER_KEY,
};
