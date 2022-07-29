const readDataFromSlot = require('../helpers/readdatafromslot.js')
const { MessageEmbed, Formatters } = require('discord.js')

const backupList = async (interaction) => {

	const guild = interaction.guild

	const serverStateInfos = []
	for (let slot = 1; slot < 10; ++slot) {
		const serverState = await readDataFromSlot(guild.id, slot)
			.catch(console.error)
		const serverStateInfo = serverState?.info || null
		serverStateInfos.push(serverStateInfo)
	}

	const fields = []
	for (const [index, serverStateInfo] of serverStateInfos.entries()) {
		const slotNumber = index + 1
		const dateCreated = Formatters.time(new Date(serverStateInfo?.date || 0), `R`)
		const info = 
			serverStateInfo === null ?
			`Empty` :
			`**Title:** ${serverStateInfo?.title || `Untitled`}\n**Created:** ${dateCreated}`

		const field = {
			name: `Slot ${slotNumber}`,
			value: info
		}
		fields.push(field)
	}

	const embed = new MessageEmbed()
		.setColor('#A50A39')
		.setTitle('Backup list')
		.setDescription('Information from all backup slots for this guild')
		.addFields(...fields)
		.setTimestamp()

	interaction.reply({embeds: [embed], ephemeral: false})
}

module.exports = backupList