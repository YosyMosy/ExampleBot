import { Client, Intents } from "discord.js";
import { readdirSync } from "node:fs";
import config from "../base/config.js";

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
    readdirSync("./src/Handlers").map(async (file) => {
      const handlerFile = await import(`../Handlers/${file}`);
      const handler = handlerFile.default;
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
