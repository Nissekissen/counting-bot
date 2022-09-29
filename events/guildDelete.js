const fs = require("fs")

module.exports = {
    name: 'guildDelete',
    async execute(guild) {
        const path = `./servers/${guild.id}`
        if (!fs.existsSync(path)) return;
        try {
            fs.rmSync(path)
          } catch (err) {
            console.error(`Error while deleting ${path}.`)
          }
        console.log("Left server " + guild.name)
    }
}