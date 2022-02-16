const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  apiKey: "Scq9I3qpH3TbCBt0DllQRBGKCAm4x8ZM",
  httpAdapter: "https",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
