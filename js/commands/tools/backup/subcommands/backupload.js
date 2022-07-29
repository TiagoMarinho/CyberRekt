const loadServerState = require('../helpers/loadserverstate')
const { MessageEmbed } = require('discord.js')

const backupLoad = async (interaction) => {

	const client = interaction.client
	const guild = interaction.guild
	const slot = interaction.options.getInteger(`slot`)

	await interaction.deferReply({ephemeral: false})
	loadServerState(client, guild, slot).then(async (loadStatuses) => {
		if (loadStatuses === null)
			return interaction.editReply(`Slot ${slot} is empty`)

		await interaction.editReply(`Deployed backup from slot ${slot}`)

		const channelFailureFields = loadStatuses.channels
			.filter(status => status.error !== null)
			.map(status => ({
				name: status.error.message,
				value: `<#${status.id}>`
			}))
			
		const roleFailureFields = loadStatuses.roles
			.filter(status => status.error !== null)
			.map(status => ({
				name: status.error.message,
				value: `<@&${status.id}>`
			}))

		if (channelFailureFields.length + roleFailureFields.length === 0)
			return

		const embeds = []

		if (channelFailureFields.length > 0) {
			const channelEmbed = new MessageEmbed()
				.setColor('#A50A39')
				.setTitle('Failed to load channel data')
				.setDescription(`List of channels that failed to load backup data:`)
				.addFields(...channelFailureFields)
			embeds.push(channelEmbed)
		}

		if (roleFailureFields.length > 0) {
			const roleEmbed = new MessageEmbed()
				.setColor('#A50A39')
				.setTitle('Failed to load role data')
				.setDescription(`List of roles that failed to load backup data:`)
				.addFields(...roleFailureFields)
			embeds.push(roleEmbed)
		}

		interaction.followUp({ embeds: embeds, ephemeral: true })
		
	}).catch(err => {
		console.error(`\n${guild.name} (${guild.id}) failed to load backup from slot ${slot}\n`, err)
		interaction.editReply(`Failed to load backup from slot ${slot}`)
	})

}

module.exports = backupLoad