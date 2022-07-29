const { MessageActionRow, MessageButton, MessageEmbed, Formatters } = require('discord.js');
const readDataFromSlot = require('../helpers/readdatafromslot');

const backupManage = async (interaction) => {
	let slot = interaction.options.getInteger(`slot`) || 1

	await interaction.deferReply({ephemeral: false})
	const response = await renderPage(interaction.client, interaction.guild, slot)
	const reply = await interaction.editReply(response)

	const minutesToMilliseconds = min => 1000 * 60 * min
	const collectorDuration = minutesToMilliseconds(5)
	const collector = reply.createMessageComponentCollector({ componentType: 'BUTTON', time: collectorDuration })

	collector.on(`collect`, async (i) => {

		if (i.user.id !== interaction.user.id) 
			return i.reply({ content: `These buttons aren't for you!`, ephemeral: true })

		switch (i.customId) {
			case `previous`:
				const prev = await renderPage(interaction.client, interaction.guild, --slot)
				i.deferUpdate()
				interaction.editReply(prev)
				break
			case `next`:
				const next = await renderPage(interaction.client, interaction.guild, ++slot)
				i.deferUpdate()
				interaction.editReply(next)
				break
		}
	})
}
const renderPage = async (client, guild, slot) => {

	const slotData = await readDataFromSlot(guild.id, slot)
		.catch(console.error)

	const rowData = [
		[
			{label: `Load`, id: `load`, style: `DANGER`},
			{label: `Overwrite`, id: `save`, style: `DANGER`},
		],
		[
			{label: `Previous`, id: `previous`, style: `SECONDARY`, disabled: slot === 1},
			{label: `Next`, id: `next`, style: `SECONDARY`, disabled: slot === 9},
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

	const author = await client.users.fetch(slotData?.info?.user)
	const creationDate = slotData ? Formatters.time(new Date(slotData.info.date), `R`) : `empty`
	const authorString = author ? `${author.username}#${author.discriminator}` : `empty`

	const embed = new MessageEmbed()
		.setColor('#A50A39')
		.setTitle('Backup Management')
		.setDescription('Manage all backups for this guild')
		.addFields(
			{name: `Slot`, value: `${slot}`},
			{name: `Status`, value: `Populated`},
			{name: `Title`, value: slotData?.info?.title || `Untitled`},
			{name: `Created`, value: creationDate},
			{name: `Author`, value: authorString},
		)
		.setTimestamp()

	return {embeds: [embed], components: rows}
}

module.exports = backupManage