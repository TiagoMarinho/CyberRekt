const fs = require('node:fs');

const readDataFromSlot = async (guildId, slot) => {
	const dir = `./db/server save states/${guildId}`
	const filePath = `${dir}/slot${slot}.json`
	const file = await fs.promises.readFile(filePath)
	const data = JSON.parse(file)
	return data
}

module.exports = readDataFromSlot