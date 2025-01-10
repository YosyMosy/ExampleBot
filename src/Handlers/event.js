const { readdirSync } = require("node:fs");

module.exports = {
  async execute(client) {
    const eventFiles = readdirSync("./src/Events");

    Promise.all(
      eventFiles.map(async (file) => {
        const event = await require(`../Events/${file}`);

        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      }),
    );

    // Process Listeners
    process.on("unhandledRejection", (e) => {
      console.log(e);
    });
    process.on("uncaughtException", (e) => {
      console.log(e);
    });
    process.on("uncaughtExceptionMonitor", (e) => {
      console.log(e);
    });
  },
};
