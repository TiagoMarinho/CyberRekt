const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savestateslots')
		.setDescription('Displays populated server save state slots')
		.setDefaultMemberPermissions(0),
	async execute(interaction) {

		const guildDir = `./db/server save states/${interaction.guild.id}`

		if (!fs.existsSync(guildDir))
			fs.mkdirSync(guildDir)

		const slotStatuses = []
		for (let slot = 1; slot < 10; ++slot) {
			const filePath = `${guildDir}/slot${slot}.json`
			const slotStatus = {
				name: `Slot ${slot}`, 
				value: `Empty`, 
				inline: true
			}
			if (fs.existsSync(filePath)) {
				const slotFileData = fs.readFileSync(filePath)
				const saveState = JSON.parse(slotFileData)

				slotStatus.value = saveState.info.title ?? `Untitled`
			}
			slotStatuses.push(slotStatus)
		}

		const slotsEmbed = new MessageEmbed()
			.setColor('#ee0d44')
			.setTitle('Save State Slots')
			.setDescription(`Status of server state slots for "${interaction.guild.name}"`)
			.addFields(
				...slotStatuses
			)
			.setTimestamp()

		interaction.reply({embeds: [slotsEmbed]})
	},
};