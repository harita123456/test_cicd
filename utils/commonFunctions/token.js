const jwt = require("jsonwebtoken");

const { JWT_KEY } = require("../../constants/env");

const userToken = async (fData) => {
  const data = jwt.sign({ id: fData._id }, JWT_KEY);
  return data;
};

module.exports = { userToken };
