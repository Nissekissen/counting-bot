const { ActivityType } = require("discord.js")
const fs = require("fs");
const logger = require("../utils/logger");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        logger.log('Bot started')
        client.user.setPresence({
            activities: [{ name: `with numbers`, type: ActivityType.Playing }],
            status: 'online',
          });
    }
}