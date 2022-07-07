const saveServerState = require('../helpers/saveserverstate');

const backupSave = async (interaction) => {

	const guild = interaction.guild
	const slot = interaction.options.getInteger(`slot`)
	const title = interaction.options.getString(`title`)
	const user = interaction.user

	saveServerState(guild, slot, title, user).then(_ => {
		interaction.reply({content: `Saved backup to slot ${slot}`, ephemeral: true})
	}).catch(err => {
		console.error(`\n${guild.name} failed to save backup to slot ${slot}\n`, err)
		interaction.reply({content: `Failed to save backup to slot ${slot}`, ephemeral: true})
	})
}

module.exports = backupSave