const { scryptSync, timingSafeEqual } = require('crypto')

const compareHash = interaction => {
	const password = interaction.options.getString(`input`)
	const compareHash = interaction.options.getString(`hash`)
	const [salt, key] = compareHash.split(`:`)
	const hashedBuffer = scryptSync(password, salt, 64)

	const keyBuffer = Buffer.from(key, `hex`)

	const match = timingSafeEqual(hashedBuffer, keyBuffer)

	return interaction.reply(match ? `**SUCCESS**: String matches hash` : `**FAILURE**: String does not match hash`);
}
module.exports = compareHash