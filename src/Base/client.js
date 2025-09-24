const { readdirSync } = require("node:fs");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

module.exports = class BaseClient {
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
};
