const writeDataToSlot = require("./writedatatoslot.js")

const saveServerState = async (guild, slot, title) => {
	const channelNamesById = {}
	guild.channels.cache.forEach(channel => channelNamesById[channel.id] = channel.name)

	const saveState = {
		info: {
			title: title
		},
		data: {
			channels: channelNamesById
		}
	}

	await writeDataToSlot(guild.id, slot, saveState)
}

module.exports = saveServerState