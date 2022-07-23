const { SlashCommandBuilder } = require('@discordjs/builders');
const { createCanvas } = require('canvas')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('asciiart')
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
			)),
	async execute(interaction) {

		const text = interaction.options.getString(`input`).toUpperCase()
		const fontName = interaction.options.getString(`font`) || 'roman'
		const font = require(`./fonts/${fontName}.json`)

		const result = text
			.split(``)
			.filter(char => typeof font[char] !== `undefined`)
			.map(char => font[char])

		const final = 
			new Array(font.info.height)
			.fill()
			.map((_, index) => result.reduce(
				(accumulator, fontChar) => 
				`${accumulator}${fontChar[index]}  `, ``
			))
			.join(`\n`)
		
		interaction.reply(`\`\`\`${final}\`\`\``)
	},
};