/**
* Create/update/set other variable for Error handling if need!
* You can manage production and developer Error return method
____prod___ ___dev___
 */
const { NODE_ENV, IS_LOCAL } = require("../../constants/env");

const sendErrorDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode: statusCode,
    status: false,
    message: err.message.replace('"', "").replace('"', "").replace('"', ""),
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    res.status(statusCode).json({
      statusCode: statusCode,
      status: false,
      message: err.message.replace('"', "").replace('"', "").replace('"', ""),
    });
  } else {
    res.status(statusCode).json({
      statusCode: statusCode,
      status: false,
      message: "Something went very wrong.",
    });
  }
};

module.exports = (err, req, res, next) => {
  if (NODE_ENV === "prod" && !IS_LOCAL) {
    sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};
