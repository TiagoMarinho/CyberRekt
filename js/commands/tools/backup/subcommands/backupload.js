const loadServerState = require('../helpers/loadserverstate');

const backupLoad = async (interaction) => {

	const guild = interaction.guild
	const slot = interaction.options.getInteger(`slot`)

	await interaction.deferReply({ephemeral: false})
	loadServerState(guild, slot).then(_ => {
		interaction.editReply(`Deployed backup from slot ${slot}`)
	}).catch(err => {
		console.error(`\n${guild.name} failed to load backup from slot ${slot}\n`, err)
		interaction.editReply(`Failed to load backup from slot ${slot}`)
	})

}

module.exports = backupLoad