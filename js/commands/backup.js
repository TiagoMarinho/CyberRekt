const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const { MessageActionRow, MessageButton } = require('discord.js');
const saveServerState = require('../backup/saveserverstate');
const loadServerState = require('../backup/loadserverstate');
const listServerStates = require('../backup/listserverstates');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('Manage backups')
		.setDefaultMemberPermissions(0)

		.addSubcommand(subcommand => 
			subcommand
				.setName(`save`)
				.setDescription(`Save a backup`)
				.addIntegerOption(option => 
					option.setName('slot')
					.setDescription(`Select which slot to save the server state to`)
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(9))
				.addStringOption(option => 
					option.setName('title')
					.setDescription(`Give a name to the save state`)))

		.addSubcommand(subcommand => 
			subcommand
				.setName(`load`)
				.setDescription(`Load a backup`)
				.addIntegerOption(option => 
					option.setName('slot')
					.setDescription(`Select which slot to load the server state from`)
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(9))
		)

		.addSubcommand(subcommand => 
			subcommand
				.setName(`list`)
				.setDescription(`Lists all backup slots`)
		),

	async execute(interaction) {

		const guild = interaction.guild
		const slot = interaction.options.getInteger(`slot`)
		const title = interaction.options.getString(`title`)
		const user = interaction.user

		switch (interaction.options.getSubcommand()) {
			case `save`:
				saveServerState(guild, slot, title, user).then(_ => {
					interaction.reply({content: `Saved backup to slot ${slot}`, ephemeral: true})
				}).catch(err => {
					console.error(`\n${guild.name} failed to save backup to slot ${slot}\n`, err)
					interaction.reply({content: `Failed to save backup to slot ${slot}`, ephemeral: true})
				})
				break;
			case `load`:
				await interaction.deferReply({ephemeral: true})
				loadServerState(guild, slot).then(_ => {
					interaction.editReply(`Deployed backup from slot ${slot}`)
				}).catch(err => {
					console.error(`\n${guild.name} failed to load backup from slot ${slot}\n`, err)
					interaction.editReply(`Failed to load backup from slot ${slot}`)
				})
				break;
			case `list`:
				const serverStateInfos = await listServerStates(guild)
				interaction.reply({content: `\`\`\`json\n${JSON.stringify(serverStateInfos, null, `\t`)}\n\`\`\``, ephemeral: true})
				break;
		}
	},
};