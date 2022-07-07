const readDataFromSlot = require('../helpers/readdatafromslot.js');
const { MessageEmbed, Formatters } = require('discord.js');

const backupList = async (interaction) => {

	const guild = interaction.guild

	const serverStateInfos = []
	for (let slot = 1; slot < 10; ++slot) {
		const serverState = await readDataFromSlot(guild.id, slot).catch(console.error)
		const serverStateInfo = serverState?.info
		serverStateInfos.push(serverStateInfo)
	}

	const fields = []
	for (const [index, serverState] of serverStateInfos.entries()) {
		if (typeof serverState === `undefined`) {
			const field = {
				name: `Slot ${index + 1}`,
				value: `Empty`
			}
			fields.push(field)
			continue
		}

		const dateCreated = Formatters.time(new Date(serverState.date), `R`)
		const field = {
			name: `Slot ${index + 1}`,
			value: `Title: ${serverState.title}\nCreated: ${dateCreated}`
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