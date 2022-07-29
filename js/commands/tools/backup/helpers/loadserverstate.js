const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const readDataFromSlot = require("./readdatafromslot")

const loadServerState = async (client, guild, slot) => {

	const saveState = await readDataFromSlot(guild.id, slot)

	if (saveState === null)
		return null

	const { title } = saveState.info
	const { channels, roles } = saveState.data

	const ownRole = guild.roles.botRoleFor(client.user)

	const channelLoadStatuses = []
	const roleLoadStatuses = []

	for (const id of Object.keys(channels)) {
		const channel = guild.channels.cache.get(id)
		const status = {
			previousName: channel?.name,
			newName: channels[id],
			id: id,
			error: null
		}
		await channel?.edit({ name: channels[id] })
			.catch(err => {
				status.error = err
			})

		channelLoadStatuses.push(status)
	}
	
	for (const id of Object.keys(roles)) {
		if (id === ownRole?.id)
			continue
		
		const role = guild.roles.cache.get(id)
		const status = {
			previousName: role?.name,
			newName: roles[id],
			id: id,
			error: null
		}
		
		await guild.roles.cache.get(id)?.edit({ name: roles[id] })
			.catch(err => {
				status.error = err
			})

		roleLoadStatuses.push(status)
	}

	return {channels: channelLoadStatuses, roles: roleLoadStatuses}
}

module.exports = loadServerState