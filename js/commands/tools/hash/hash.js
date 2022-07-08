const { SlashCommandBuilder } = require('@discordjs/builders');
const compareHash = require('./subcommands/hashcompare');
const createHash = require('./subcommands/hashcreate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hash')
		.setDescription('Create and compare hashes')

		.addSubcommand(subcommand => 
			subcommand
				.setName(`create`)
				.setDescription(`Hashes a given string`)
				.addStringOption(option => 
					option.setName('input')
					.setDescription(`String to hash`)
					.setRequired(true))
		)
		
		.addSubcommand(subcommand => 
			subcommand
				.setName(`compare`)
				.setDescription(`Compares a hash and a string`)
				.addStringOption(option => 
					option.setName('input')
					.setDescription(`String to compare`)
					.setRequired(true))
				.addStringOption(option => 
					option.setName('hash')
					.setDescription(`Hash to compare`)
					.setRequired(true))
		),
	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
			case `create`:
				createHash(interaction)
			break;
			case `compare`:
				compareHash(interaction)
			break;
		}
	},
};