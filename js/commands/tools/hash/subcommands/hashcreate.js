const { scryptSync, randomBytes } = require('crypto')

const createHash = interaction => {
	const input = interaction.options.getString(`input`)
	const salt = randomBytes(16).toString(`hex`)
	const hash = scryptSync(input, salt, 64).toString(`hex`)
	return interaction.reply(`\`\`\`${salt}:${hash}\`\`\``);
}
module.exports = createHash