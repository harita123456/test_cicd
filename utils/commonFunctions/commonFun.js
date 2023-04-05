const { APISTATUS } = require("../../constants/env");

const successRes = async (res, msg, data) => {
  return res.status(APISTATUS.OK).json({
    success: true,
    statuscode: APISTATUS.OK,
    message: msg,
    data: data,
  });
};

const multiSuccessRes = async (res, msg, data, total_count) => {
  return res.status(APISTATUS.OK).json({
    success: true,
    statuscode: APISTATUS.OK,
    message: msg,
    total_number_of_data: total_count,
    data: data,
  });
};

const errorRes = async (res, msg) => {
  return res.status(APISTATUS.NOT_FOUND).json({
    success: false,
    statuscode: APISTATUS.NOT_FOUND,
    message: msg,
  });
};

const authFailRes = async (res, msg) => {
  return res.status(401).json({
    success: false,
    statuscode: 101,
    message: msg,
  });
  // return res.status(APISTATUS.OK).json({
  //   success: false,
  //   statuscode: 101,
  //   message: msg,
  // });
};

const webAuthFailRes = async (res, msg) => {
  return res.send({
    success: false,
    statuscode: 101,
    message: msg,
  });
};

const statusSuccessRes = async (res, msg, data, any_status) => {
  return res.send({
    success: true,
    statuscode: APISTATUS.OK,
    message: msg,
    any_status: any_status,
    data: data,
  });
};

module.exports = {
  successRes,
  errorRes,
  authFailRes,
  webAuthFailRes,
  multiSuccessRes,
  statusSuccessRes,
};
