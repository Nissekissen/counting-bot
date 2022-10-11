const { ActivityType, EmbedBuilder } = require("discord.js")
const fs = require("fs");
const logger = require("../utils/logger");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        logger.log('Bot started')
        client.user.setPresence({
            activities: [{ name: `counting reset, do /setup`, type: ActivityType.Playing }],
            status: 'online',
          });
    }
}