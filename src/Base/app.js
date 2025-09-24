const BaseClient = require("./client.js");
const config = require("./config.js");

const token = config.token;
const client = new BaseClient(token);

client.start();
