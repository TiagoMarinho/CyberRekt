const fs = require('node:fs');

const readDataFromSlot = async (guildId, slot) => {
	const path = `./db/server save states/${guildId}`
	const fullPath = `${path}/slot${slot}.json`

	await fs.promises.mkdir(path, { recursive: true })

	await fs.promises.access(fullPath, fs.constants.F_OK)

	const file = await fs.promises.readFile(fullPath)

	const data = JSON.parse(file)

	return data
}

module.exports = readDataFromSlot