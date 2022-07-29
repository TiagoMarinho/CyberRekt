const fs = require('node:fs')

const readDataFromSlot = async (guildId, slot) => {
	const dir = `./db/guilds/${guildId}/backups`
	const filePath = `${dir}/slot${slot}.json`
	return fs.promises.readFile(filePath)
		.then(file => {
			const data = JSON.parse(file)
			return data
		})
		.catch(err => {
			switch (err.code) {
				case `ENOENT`:
					return null
				default:
					throw err
			}
		})
}

module.exports = readDataFromSlot