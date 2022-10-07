const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('../config.json');

const commands = [];
const commandsRaw = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../src/commands/${file}`);
	if (command.data.name == 'help')  {
		for (const commandFile of commandFiles) {
			const commandFileRequired = require(`../src/commands/${commandFile}`);
			command.data.options[0].addChoices({ name: commandFileRequired.data.name, value: commandFileRequired.data.name })
		}
	}
	commands.push(command.data.toJSON());
	commandsRaw.push(command);
}

const subcommandFolders = fs.readdirSync('./src/subcommands/');

for (const subcommandFolder of subcommandFolders) {
	const subcommandFiles = fs.readdirSync(`./src/subcommands/${subcommandFolder}`).filter(file => file.endsWith('js'));
	const motherCommand = commandsRaw.find(command => command.data.name == subcommandFolder);
	for (const subcommandFile of subcommandFiles) {
		const data = require(`../src/subcommands/${subcommandFolder}/${subcommandFile}`);
		data.register(motherCommand.data);
	}
	let motherCommandData = motherCommand.data.toJSON();
	const oldCommandIndex = commands.findIndex(command => command.name == subcommandFolder);
	if (oldCommandIndex != -1) commands.splice(oldCommandIndex)
	commands.push(motherCommandData);
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);