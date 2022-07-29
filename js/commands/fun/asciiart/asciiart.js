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
			)),
	async execute(interaction) {

		const text = interaction.options.getString(`input`).toUpperCase()
		const fontName = interaction.options.getString(`font`) || 'roman'
		const font = require(`./fonts/${fontName}.json`)
		const color = (interaction.options.getString(`color`) || `00`)
		const colorID = color.split(``).map(s => parseInt(s))

		const prefixes = [``, `# `, `- `, `+ `]
		const langs = [``, `markdown`, `diff`, `fix`]
		const prefix = prefixes[colorID[0]]
		const lang = langs[colorID[1]]

		const result = text
			.split(``)
			.filter(char => typeof font[char] !== `undefined`)
			.map(char => font[char])

		const final = 
			new Array(font.info.height)
			.fill()
			.map((_, index) => prefix + result.reduce(
				(accumulator, fontChar) => 
				`${accumulator}${fontChar[index]}  `, ``
			))
			.join(`\n`)
		
		interaction.reply(`\`\`\`${lang}\n${final}\n\`\`\``)
	},
};