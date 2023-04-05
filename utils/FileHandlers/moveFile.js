const fs = require("fs");
const path = require("path");
const { APISTATUS } = require("../../constants/env");
const AppError = require("../ErrorHandlers/AppError");
/**
 * Adds two numbers together.
 * @param {String} FileName Pass file name which you
 * want to move to another directory.
 * @param {String} Dir2 Pass directory name where you want to move
 */
module.exports = (FileName, Dir2) => {
  const Path1 = `${__dirname}/../../assets/images/temp/${FileName}`;
  const Path2 = Dir2;
  const Source = path.basename(Path1);
  const Destination = path.resolve(Path2, Source);
  fs.rename(Path1, Destination, (Err) => {
    if (Err) new AppError("File has been not moved...!", APISTATUS.NOT_FOUND);
  });
};
