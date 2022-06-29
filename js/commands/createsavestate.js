const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createsavestate')
		.setDescription('Saves the current state of the server!')
		.setDefaultMemberPermissions(0)
		.addIntegerOption(option => 
			option.setName('slot')
			.setDescription(`Select which slot to save the server state in`)
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(9))
		.addStringOption(option => 
			option.setName('title')
			.setDescription(`Give a name to the save state`)),
	async execute(interaction) {
		
		const channels = {}
		interaction.guild.channels.cache.forEach(channel => {
			channels[`${channel.id}`] = {
				name: channel.name
			}
		})

		const roles = {}
		interaction.guild.roles.cache.forEach(role => {
			roles[`${role.id}`] = {
				name: role.name
			}
		})

		const slot = interaction.options.getInteger(`slot`)
		const title = interaction.options.getString(`title`)

		const saveState = {
			info: {
				title: title
			},
			data: {
				channels: channels,
				roles: roles
			}
		}

		const guildDir = `./db/server save states/${interaction.guild.id}`

		if (!fs.existsSync(guildDir))
			fs.mkdirSync(guildDir)

		const filePath = `${guildDir}/slot${slot}.json`

		const json = JSON.stringify(saveState, null, `\t`)
		fs.writeFile(filePath, json, `utf-8`, err => {
			if (err) {
				interaction.reply({content: `Error writing server state file in slot ${slot}`, ephemeral: true})
				console.log(`\nError writing server state file in slot ${slot}:\n${err}\n`)
			} else {
				interaction.reply({content: `Server state saved in slot ${slot}`, ephemeral: true})
				console.log(`Successfully wrote server save state in slot ${slot} for ${interaction.guild.name}`)
			}
		})
	},
};