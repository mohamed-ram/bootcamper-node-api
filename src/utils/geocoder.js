const NodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");
const path = require("path");

// dotenv config
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: "https",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
