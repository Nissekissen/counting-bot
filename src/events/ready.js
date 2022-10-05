const { ActivityType } = require("discord.js")
const fs = require("fs")

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log('Bot started')
        client.user.setPresence({
            activities: [{ name: `with numbers`, type: ActivityType.Playing }],
            status: 'online',
          });
    }
}