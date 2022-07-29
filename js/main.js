const fs = require('node:fs')
const path = require('node:path')
const { Client, Collection, Intents } = require('discord.js')
const { token } = require('../config.json')
const fetchCommandsByCategory = require('./helpers/fetchcommands')

class DiscordBot {

	client = new Client({ intents: [Intents.FLAGS.GUILDS] })
	activityStatus = [`channels disappear`, {type: `WATCHING`}]

	login () {
		this.client.once('ready', () => {
			console.log(`Ready!`)
			this.client.user.setActivity(...this.activityStatus)
		});

		this.client.login(token);
	}
	loadCommands () {
		this.client.commands = new Collection()

		const commandsByCategory = fetchCommandsByCategory(`./js/commands`)

		for (const categoryName of Object.keys(commandsByCategory)) {
			for (const command of commandsByCategory[categoryName]) {
				this.client.commands.set(command.data.name, command)
			}
		}
	}
	handleCommands () {
		this.client.on('interactionCreate', async interaction => {
			if (!interaction.isCommand()) return
		
			const command = this.client.commands.get(interaction.commandName)
		
			if (!command) return

			const fullUserTag = `${interaction.user.username}#${interaction.user.discriminator}`
			console.log(`${fullUserTag} used /${interaction.commandName}`)
		
			try {
				await command.execute(interaction)
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
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
cyberRekt.login()
cyberRekt.loadCommands()
cyberRekt.handleCommands()
cyberRekt.listenToRateLimit()