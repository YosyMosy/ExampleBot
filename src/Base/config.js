const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  prefix: "!",
  owners: ["Owner ID"],
  token: process.env.BOT_TOKEN,
};
