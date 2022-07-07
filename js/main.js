const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('../config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandCategoryFolders = fs.readdirSync('./js/commands');
for (const categoryFolder of commandCategoryFolders) {
	const commandFolders = fs.readdirSync(`./js/commands/${categoryFolder}`);
	for (const commandFolder of commandFolders) {
		const commandFiles = fs.readdirSync(`./js/commands/${categoryFolder}/${commandFolder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.resolve(__dirname, `commands/${categoryFolder}/${commandFolder}/${file}`)
			const command = require(filePath);
			client.commands.set(command.data.name, command);
		}
	}
}

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity(`channels disappear`, {type: `WATCHING`})
});

client.on('rateLimit', (info) => {
	console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);