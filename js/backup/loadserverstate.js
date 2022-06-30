const readDataFromSlot = require("./readdatafromslot")


const loadServerState = async (guild, slot) => {
	const saveState = await readDataFromSlot(guild.id, slot)

	const { title } = saveState.info
	const { channels } = saveState.data

	for (const id of Object.keys(channels)) {
		await guild.channels.edit(id, { name: channels[id] })
	}
}

module.exports = loadServerState