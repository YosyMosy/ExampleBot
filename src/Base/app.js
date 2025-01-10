const { Client, Intents } = require("discord.js");
const { readdirSync } = require("node:fs");
const config = require("../base/config.js");

class BaseClient {
  constructor(token) {
    this.client = new Client({
      intents: Object.values(Intents.FLAGS),
      partials: [
        "USER",
        "CHANNEL",
        "GUILD_MEMBER",
        "MESSAGE",
        "REACTION",
        "GUILD_SCHEDULED_EVENT",
      ],
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
