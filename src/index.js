const fs = require('fs')
const { Client, Collection, EmbedBuilder, GatewayIntentBits, ActivityType } = require('discord.js')
const { token, topgg_token } = require('../config.json')
const { AutoPoster } = require('topgg-autoposter')
const logger = require('./utils/logger')
const { readFile } = require('./utils/fileUtils')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers], presence: { activities: [{ name: 'with numbers', type: ActivityType.Playing }] } })
client.commands = new Collection()

client.subCommands = new Collection()

const loadCommands = () => {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('js'))

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        client.commands.set(command.data.name, command)
    }
}

const loadEvents = () => {
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('js'))

    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }
}

//Part below is only if bot is using top.gg, comment out if it is not.

const ap = AutoPoster(topgg_token, client);
ap.on('posted', () => {
    logger.log('Posted stats on Top.gg!');
})
ap.on('error', error => {
    logger.log('Error while posting stats on Top.gg: ' + error);
})



loadCommands()
loadEvents()

client.login(token)
