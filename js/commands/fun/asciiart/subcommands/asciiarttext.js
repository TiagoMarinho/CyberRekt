const asciiArtText = async (interaction) => {
	const text = interaction.options.getString(`input`).toUpperCase()
	const fontName = interaction.options.getString(`font`) || 'roman'
	const font = require(`../fonts/${fontName}.json`)
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
}
module.exports = asciiArtText