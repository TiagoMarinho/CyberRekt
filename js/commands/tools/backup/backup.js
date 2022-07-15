const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const { MessageActionRow, MessageButton, MessageEmbed, Formatters } = require('discord.js');
const saveServerState = require('./helpers/saveserverstate');
const loadServerState = require('./helpers/loadserverstate');
const listServerStates = require('./helpers/listserverstates');
const backupSave = require('./subcommands/backupsave');
const backupLoad = require('./subcommands/backupload');
const backupList = require('./subcommands/backuplist');
const backupManage = require('./subcommands/backupmanage');

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
		)

		.addSubcommand(subcommand => 
			subcommand
				.setName(`manage`)
				.setDescription(`Manage all backups`)
		),

	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
			case `save`:
				backupSave(interaction)
				break;
			case `load`:
				backupLoad(interaction)
				break;
			case `list`:
				backupList(interaction)
				break;
			case `manage`:
				backupManage(interaction)
				break;
		}
	},
};