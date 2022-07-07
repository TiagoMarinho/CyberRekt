const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('../config.json');

class DiscordBot {
	
	client = new Client({ intents: [Intents.FLAGS.GUILDS] });

	run () {
		this.client.once('ready', () => {
			console.log(`Ready!`)
			this.client.user.setActivity(`channels disappear`, {type: `WATCHING`})

			this.fetchCommands()
			this.handleCommands()
			this.listenToRateLimit()
		});

		this.client.login(token);
	}
	fetchCommands () {
		this.client.commands = new Collection();
		
		const commandCategoryFolders = fs.readdirSync('./js/commands');
		for (const categoryFolder of commandCategoryFolders) {
			const commandFolders = fs.readdirSync(`./js/commands/${categoryFolder}`);
			for (const commandFolder of commandFolders) {
				const commandFiles = fs.readdirSync(`./js/commands/${categoryFolder}/${commandFolder}`).filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					const filePath = path.resolve(__dirname, `commands/${categoryFolder}/${commandFolder}/${file}`)
					const command = require(filePath);
					this.client.commands.set(command.data.name, command);
				}
			}
		}
	}
	handleCommands () {
		this.client.on('interactionCreate', async interaction => {
			if (!interaction.isCommand()) return;
		
			const command = this.client.commands.get(interaction.commandName);
		
			if (!command) return;
		
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		});
	}
	listenToRateLimit () {
		this.client.on('rateLimit', (info) => {
			console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
		})
	}
}

const cyberRekt = new DiscordBot()
cyberRekt.run()