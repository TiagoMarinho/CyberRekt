const readDataFromSlot = require("./readdatafromslot")


const loadServerState = async (guild, slot) => {
	const saveState = await readDataFromSlot(guild.id, slot)

	const { title } = saveState.info
	const { channels, roles } = saveState.data

	for (const id of Object.keys(channels)) {
		await guild.channels.edit(id, { name: channels[id] })
			.catch(console.error) // OPTIMIZE: temporary workaround for trying to edit channels it doesn't have access to
	}
	for (const id of Object.keys(roles)) {
		await guild.roles.edit(id, { name: roles[id] })
			.catch(console.error) // OPTIMIZE: temporary workaround for trying to edit its own role
	}
}

module.exports = loadServerState