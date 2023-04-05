const _FILE_CONFIG = {
  TEMP: {
    dirName: "temp/",
    projectDir: "./assets/images/temp/",
    rootDir: `${__dirname}/../../assets/images/temp/`,
  },
  USER_PROFILE_PIC: {
    dirName: "profile_picture/",
    projectDir: "./assets/images/profile_picture/",
    rootDir: `${__dirname}/../../assets/images/profile_picture/`,
    filePrefix: Math.floor(1000 + Math.random() * 9000) + "_",
  },
};

module.exports = {
  _FILE_CONFIG,
};
