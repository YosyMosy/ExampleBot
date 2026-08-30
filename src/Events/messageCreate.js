import { ChannelType, Collection, Events } from "discord.js";
import config from "../Base/config.js";
// 1. PANGGIL: Import schema MongoDB (pastikan ekensinya .js di akhir jika pakai ES Modules)
import User from "../Models/userSchema.js"; 

const cooldown = new Collection();

export default {
	name: Events.MessageCreate,
	async execute(message) {
		const { client } = message;

		if (message.author.bot) {
			return;
		}

		if (message.channel.type === ChannelType.DM) {
			return;
		}

		// 2. LOGIKA MONGODB: Tambah XP setiap kali user mengirim pesan di server (bukan DM)
		try {
			let userData = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
			
			if (!userData) {
				userData = new User({ userId: message.author.id, guildId: message.guild.id });
			}
			
			userData.xp += 10; // Menambah 10 XP setiap mengetik chat
			await userData.save();
		} catch (err) {
			console.error("Gagal menyimpan data ke MongoDB:", err);
		}

		// --- Batas logika MongoDB, di bawah ini kode bawaan perintah prefix bot kamu ---

		const { prefix } = config;
		if (!message.content.startsWith(prefix)) {
			return;
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift().toLowerCase();

		if (cmd.length === 0) {
			return;
		}

		let command = client.commands.get(cmd);
		command ||= client.commands.get(client.commandAliases.get(cmd));

		if (command) {
			if (command.ownerOnly && !config.owners.includes(message.author.id)) {
				return message.reply({
					content: "Only my **developers** can use this command.",
				});
			}

			if (command.cooldown) {
				if (cooldown.has(`${command.name}-${message.author.id}`)) {
					const nowDate = message.createdTimestamp;
					const waitedDate =
						cooldown.get(`${command.name}-${message.author.id}`) - nowDate;
					return message
						.reply({
							content: `Cooldown is currently active, please try again <t:${Math.floor(
								new Date(nowDate + waitedDate).getTime() / 1000,
							)}:R>.`,
						})
						.then((msg) =>
							setTimeout(
								() => msg.delete(),
								cooldown.get(`${command.name}-${message.author.id}`) -
									Date.now() +
									1000,
							),
						);
				}

				command.prefixRun(message, args);

				cooldown.set(
					`${command.name}-${message.author.id}`,
					Date.now() + command.cooldown,
				);

				setTimeout(() => {
					cooldown.delete(`${command.name}-${message.author.id}`);
				}, command.cooldown);
			} else {
				command.prefixRun(message, args);
			}
		}
	},
};
