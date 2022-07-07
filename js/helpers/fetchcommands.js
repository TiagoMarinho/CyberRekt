const fs = require('node:fs');
const path = require('node:path');

const fetchCommandsByCategory = _ => {
	const commandsByCategory = {}

	const commandCategoryFolders = fs.readdirSync(`./js/commands`)
	for (const categoryFolder of commandCategoryFolders) {
		const commandFolders = fs.readdirSync(`./js/commands/${categoryFolder}`, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name)

		commandsByCategory[categoryFolder] = []

		for (const commandFolder of commandFolders) {
			const commandFiles = fs.readdirSync(`./js/commands/${categoryFolder}/${commandFolder}`).filter(file => file.endsWith('.js'))
			for (const file of commandFiles) {
				const filePath = path.resolve(__dirname, `../../js/commands/${categoryFolder}/${commandFolder}/${file}`)
				const command = require(filePath)

				commandsByCategory[categoryFolder].push(command)
			}
		}
	}

	return commandsByCategory
}

module.exports = fetchCommandsByCategory