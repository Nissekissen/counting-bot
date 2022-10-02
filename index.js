const fs = require('fs')
const { Client, Collection, EmbedBuilder, GatewayIntentBits, ActivityType } = require('discord.js')
const { token } = require('./config.json')


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers], presence: { activities: [{ name: 'with numbers...', type: ActivityType.Playing }] } })
client.commands = new Collection()

const loadCommands = () => {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'))

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        client.commands.set(command.data.name, command)
    }
}

const loadEvents = () => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('js'))

    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }
}

loadCommands()
loadEvents()

client.login(token)