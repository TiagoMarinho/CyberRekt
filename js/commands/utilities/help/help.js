const { SlashCommandBuilder } = require('@discordjs/builders')
const fetchCommandsByCategory = require('../../../helpers/fetchcommands')
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display all commands from this bot'),
	async execute(interaction) {
		const commandsByCategory = fetchCommandsByCategory()

		const fields = []

		for (const categoryName of Object.keys(commandsByCategory)) {
			commandsStrings = []
			for (const command of commandsByCategory[categoryName]) {
				commandsStrings.push(`\`/${command.data.name}\`: ${command.data.description}`)
			}
			const field = {
				name: categoryName.toUpperCase(),
				value: commandsStrings.join(`\n`)
			}
			fields.push(field)
		}

		const embed = new MessageEmbed()
			.setColor('#A50A39')
			.setTitle('Commands list')
			.setDescription('List of commands for this bot')
			.addFields(...fields)

		interaction.reply({embeds: [embed]})
	},
}