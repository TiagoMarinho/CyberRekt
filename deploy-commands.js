const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const fetchCommandsByCategory = require('./js/helpers/fetchcommands');

const commands = [];
const commandsByCategory = fetchCommandsByCategory()


for (const categoryName of Object.keys(commandsByCategory)) {
	for (const command of commandsByCategory[categoryName]) {
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered global application commands.'))
	.catch(console.error);