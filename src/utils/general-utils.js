const uuid = require("uuid");

const generateUUID = () => {
  return uuid.v4();
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.generateUUID = generateUUID;
exports.delay = delay;
