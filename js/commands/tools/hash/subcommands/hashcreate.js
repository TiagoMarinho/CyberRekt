const { scryptSync, randomBytes } = require('crypto')
const { MessageEmbed, Formatters } = require('discord.js')

const createHash = interaction => {
	const input = interaction.options.getString(`input`)
	const salt = randomBytes(16).toString(`hex`)
	const hash = scryptSync(input, salt, 64).toString(`hex`)

	const formattedHashCodeBlock = `\`\`\`properties\n${salt}:${hash}\`\`\``

	const embed = new MessageEmbed()
		.setColor('#A50A39')
		.setTitle('Hash result')
		.setDescription(formattedHashCodeBlock)

	interaction.reply({embeds: [embed]})
}
module.exports = createHash