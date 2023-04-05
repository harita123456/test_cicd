/**
* Here you can save request and response or also you can
use other place where you need perfect watch view
* Below comment is use for frontend developer to watch
logging file which is store in global cluster (Mongodb Database)
 */

const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const logger = createLogger({
  transports: [
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),

    // Remove this comment for save the log in mongoDB Cloud

    // new transports.MongoDB({
    //   level: "error",
    //   db: process.env.MONGODB,
    //   collection: "logger",
    //   options: { useUnifiedTopology: true },
    //   format: format.combine(format.timestamp(), format.json()),
    // }),
  ],
});

module.exports = logger;
