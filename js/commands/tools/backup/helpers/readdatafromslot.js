const fs = require('node:fs');

const readDataFromSlot = async (guildId, slot) => {
	const dir = `./db/guilds/${guildId}/backups`
	const filePath = `${dir}/slot${slot}.json`
	const file = await fs.promises.readFile(filePath)
	const data = JSON.parse(file)
	return data
}

module.exports = readDataFromSlot