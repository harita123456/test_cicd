const jwt = require("jsonwebtoken");
const { removeFile } = require("../utils/FileHandlers/deleteFile");
const {
  successRes,
  errorRes,
  authFailRes,
} = require("../utils/commonFunctions/commonFun");
const { JWT_KEY, APISTATUS, IS_TOKEN_DISABLE } = require("../constants/env");

const User = require("../models/M_user");

module.exports = {
  mCheckToken: async (req, res, next) => {
    try {
      const bearerHeader = req.headers["authorization"];

      if (!bearerHeader) {
        res.json({
          status: false,
          message: "A token is required for authentication.",
        });
      } else {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        const { id } = jwt.verify(bearerToken, JWT_KEY);

        // Find customer.
        const find_user = await User.findById(id).where({
          is_deleted: false,
          is_block: false,
        });

        if (!find_user) {
          return await authFailRes(res, "Authentication failed.");
        }
        req.user = find_user;
        next();
      }
    } catch (error) {
      if (req.file) {
        let fileName = req.file.fieldname + "/" + req.file.filename;
        removeFile(fileName);
      }

      if (error.message == "jwt malformed") {
        return await authFailRes(res, "Authentication failed.");
      }
      console.log("jwt::::::::::", error.message);
      return await errorRes(res, error.message);
    }
  },
};
