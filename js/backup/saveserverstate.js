const writeDataToSlot = require("./writedatatoslot.js")

const saveServerState = async (guild, slot, title, user) => {
	const channelNamesById = {}
	const roleNamesById = {}
	guild.channels.cache.forEach(channel => channelNamesById[channel.id] = channel.name)
	guild.roles.cache.forEach(role => roleNamesById[role.id] = role.name)

	const saveState = {
		info: {
			title: title,
			date: new Date(),
			user: user.id
		},
		data: {
			channels: channelNamesById,
			roles: roleNamesById
		}
	}

	await writeDataToSlot(guild.id, slot, saveState)
}

module.exports = saveServerState