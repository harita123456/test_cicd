const { unlink } = require("fs");
const { APISTATUS } = require("../../constants/env");
const AppError = require("../ErrorHandlers/appError");

module.exports = (Path) => {
  unlink(Path, (Err, Next) => {
    if (Err) {
      new AppError("File has been not available...!", APISTATUS.NOT_FOUND);
    }
  });
};
