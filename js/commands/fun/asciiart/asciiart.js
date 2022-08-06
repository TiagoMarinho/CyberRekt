const { SlashCommandBuilder } = require('@discordjs/builders');
const asciiArtText = require('./subcommands/asciiarttext');
const asciiArtImage = require('./subcommands/asciiartimage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('asciiart')
		.setDescription('Create ASCII art')
		.addSubcommand(subcommand => 
			subcommand
			.setName('text')
			.setDescription('Transform text into ASCII art')
			.addStringOption(option => 
				option.setName('input')
				.setDescription(`String to transform into ascii art`)
				.setRequired(true))
			.addStringOption(option => 
				option.setName('font')
				.setDescription(`What ASCII Art style to use`)
				.setChoices(
					{ name: 'Roman', value: 'roman' },
					{ name: 'ABC', value: 'abc' },
					{ name: 'Thin', value: 'thin' },
				))
			.addStringOption(option => 
				option.setName('color')
				.setDescription(`Color of text, desktop only`)
				.setChoices(
					{ name: 'White', value: '00' },
					{ name: 'Blue', value: '11' },
					{ name: 'Red', value: '22' },
					{ name: 'Green', value: '32' },
					{ name: 'Yellow', value: '03' },
				))
		)
		.addSubcommand(subcommand => 
			subcommand
			.setName('image')
			.setDescription('Transform an image into ASCII art')
			.addAttachmentOption(option => 
				option.setName('image')
				.setDescription(`Image to transform into ascii art`)
				.setRequired(true))
			.addStringOption(option => 
				option.setName('resolution')
				.setDescription(`How many characters wide the art will be`)
				.setChoices(
					{ name: 'Smartphone', value: '40' },
					{ name: 'Highest', value: '64' },
				))
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand()

		switch (subcommand) {
			case `text`: 
				asciiArtText(interaction)
			break
			case `image`:
				asciiArtImage(interaction)
			break
		}
	},
};