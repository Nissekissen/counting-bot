const fs = require("fs");
const logger = require("../utils/logger");

module.exports = {
    name: 'guildDelete',
    async execute(guild) {
        const path = `./servers/${guild.id}`
        if (!fs.existsSync(path)) return;
        try {
            fs.rmSync(path)
          } catch (err) {
            logger.log(`Error while deleting ${path}.`)
          }
        logger.log("Left server " + guild.name)
    }
}