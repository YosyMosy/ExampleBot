const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require("node:fs");
const config = require("./config.js");

class BaseClient {
  constructor(token) {
    this.client = new Client({
      intents: Object.values(GatewayIntentBits),
      partials: Object.values(Partials),
      shards: "auto",
    });
    this.token = token;
  }

  loadHandlers() {
    readdirSync("./src/Handlers").forEach(async (file) => {
      const handler = await require(`../Handlers/${file}`);
      handler.execute(this.client);
    });
  }

  start() {
    this.loadHandlers();
    this.client.login(this.token);
  }
}

const token = config.token;
const client = new BaseClient(token);
client.start();
