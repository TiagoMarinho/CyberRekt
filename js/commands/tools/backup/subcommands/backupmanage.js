const { MessageActionRow, MessageButton, MessageEmbed, Formatters } = require('discord.js');
const readDataFromSlot = require('../helpers/readdatafromslot');

const backupManage = async (interaction) => {
	await interaction.deferReply({ephemeral: false})

	const slotData = await readDataFromSlot(interaction.guild.id, 1)

	const rowData = [
		[
			{label: `Load`, id: `load`, style: `SECONDARY`},
			{label: `Overwrite`, id: `save`, style: `DANGER`},
			{label: `Delete`, id: `delete`, style: `DANGER`},
		],
		[
			{label: `Previous`, id: `previous`, style: `PRIMARY`, disabled: true},
			{label: `Next`, id: `next`, style: `PRIMARY`},
		]
	]

	const rows = rowData.map(buttonData => {
		const row = new MessageActionRow()

		const buttons = buttonData.map(button => 
			new MessageButton()
				.setCustomId(button.id)
				.setLabel(button.label)
				.setStyle(button.style)
				.setDisabled(button.disabled === true)
		)
			
		row.addComponents(...buttons)

		return row
	})

	const author = interaction.guild.members.cache.get(slotData.info.user).user // maybe undefined/null if user left server?

	const embed = new MessageEmbed()
		.setColor('#A50A39')
		.setTitle('Backup Management')
		.setDescription('Manage all backups for this guild')
		.addFields(
			{name: `Slot:`, value: `1`},
			{name: `Title:`, value: slotData.info.title},
			{name: `Created:`, value: Formatters.time(new Date(slotData.info.date), `R`)},
			{name: `Author:`, value: `${author.username}#${author.discriminator}`},
		)
		.setTimestamp()

	await interaction.editReply({embeds: [embed], components: rows})
}

module.exports = backupManage