const fs = require('node:fs');

const writeDataToSlot = async (guildId, slot, data) => {
	const path = `./db/server save states/${guildId}`
	const fullPath = `${path}/slot${slot}.json`

	await fs.promises.mkdir(path, { recursive: true })

	const json = JSON.stringify(data, null, `\t`)

	await fs.promises.writeFile(fullPath, json, `utf-8`)
}

module.exports = writeDataToSlot