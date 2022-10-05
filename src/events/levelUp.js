const { readFile } = require("../utils/fileUtils")

module.exports = {
    async execute(interaction, user) {
        const path = `./servers/${interaction.guildId}/`
        const channelId = readFile(path + "channel.txt")
        const channel = interaction.client.channels.cache.get(channelId)
        await channel.send(`Congrats <@${user.id}> for reaching level ${user.level}!`)
    }
}