const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deploysavestate')
		.setDescription('Restores a server state previously saved')
		.setDefaultMemberPermissions(0)
		.addIntegerOption(option => 
			option.setName('slot')
			.setDescription(`Select which slot to retrieve the server state from`)
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(9)),
	async execute(interaction) {

		const slot = interaction.options.getInteger(`slot`)

		const guildDir = `./db/server save states/${interaction.guild.id}`

		if (!fs.existsSync(guildDir))
			fs.mkdirSync(guildDir)

		const filePath = `${guildDir}/slot${slot}.json`

		if (!fs.existsSync(filePath))
			return interaction.reply(`Slot ${slot} is not populated`)

		const slotFileData = fs.readFileSync(filePath)
		const saveState = JSON.parse(slotFileData)

		const title = saveState.info.title
		const titleResponseStr = title ? ` titled "${title}"` : ``

		const channels = saveState.data.channels
		Object.keys(channels).forEach(id => {
			interaction.guild.channels.fetch(id)
				.then(channel => {
					if (channel.name !== channels[id].name)
						channel.edit({name: channels[id].name})
				})
				.catch(err => console.error(`\nError fetching channel "${channels[id].name}" for deployment (channel id "${id}"):\n${err}\n`))
		})

		const roles = saveState.data.roles
		Object.keys(roles).forEach(id => {
			interaction.guild.roles.fetch(id)
				.then(role => {
					if (role.name !== roles[id].name)
						role.edit({name: roles[id].name})
				})
				.catch(err => console.error(`\nError fetching role "${roles[id].name}" for deployment (role id "${id}"):\n${err}\n`))
		})

		console.log(`Deployed save state from slot ${slot} for server "${interaction.guild.name}"`)
		interaction.reply({content: `Deployed server state${titleResponseStr} from slot ${slot}`, ephemeral: true})
	},
};