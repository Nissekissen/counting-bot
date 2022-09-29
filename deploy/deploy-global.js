const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('../config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	if (command.data.name == 'help')  {
		for (const commandFile of commandFiles) {
			const commandFileRequired = require(`../commands/${commandFile}`);
			command.data.options[0].addChoices({ name: commandFileRequired.data.name, value: commandFileRequired.data.name })
		}
	}
	console.log("test" + command.data.toJSON())
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);