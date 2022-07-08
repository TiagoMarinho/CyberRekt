const { scryptSync, randomBytes } = require('crypto')

const createHash = interaction => {
	const input = interaction.options.getString(`input`)
	const salt = randomBytes(16).toString(`hex`)
	const hash = scryptSync(input, salt, 64).toString(`hex`)

	const informationString = `Salt in yellow, hash in green:`
	const formattedHashCodeBlock = `\`\`\`properties\n${salt}:${hash}\`\`\``
	return interaction.reply(`${informationString}\n${formattedHashCodeBlock}`);
}
module.exports = createHash