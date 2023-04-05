const mongoose = require("mongoose");
const { MONGODB_DATABASE_URL } = require("../constants/env");

mongoose.set("strictQuery", true);

const mongodbConnect = mongoose
  .connect(MONGODB_DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to database.");
  });

mongoose.connection.on("error", (fErr) => {
  console.log(fErr);
});

module.exports = mongodbConnect;
