import { readdirSync } from "node:fs";
import { Client, GatewayIntentBits, Partials } from "discord.js";

//MongoDB
const mongoose = require("mongoose");
//connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
	.then(() => console.log("Successfully connect to MongoDB"))
	.catch((err) => console.log("Database connection error: ", err));

export default class BaseClient {
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
