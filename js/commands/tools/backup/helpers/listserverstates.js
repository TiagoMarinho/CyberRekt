const readDataFromSlot = require("./readdatafromslot")

const listServerStates = async (guild) => {
	const serverStateInfos = []
	for (let slot = 1; slot < 10; ++slot) {
		const serverState = await readDataFromSlot(guild.id, slot)
			.catch(console.error)
		const serverStateInfo = serverState?.info
		serverStateInfos.push(serverStateInfo)
	}
	return serverStateInfos
}

module.exports = listServerStates