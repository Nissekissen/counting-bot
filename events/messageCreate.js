const fs = require("fs");
const { readFile, writeToFile } = require("../utils/fileUtils");

module.exports = {
    name: 'messageCreate',
    async execute(interaction) {
        if (interaction.member.id == interaction.client.application.id) return;
        let path = `../servers/${interaction.guildId}`
        if (!fs.existsSync(path)) return;
        if (interaction.channelId != readFile(path + "/channel.txt")) return;
        if (interaction.content == readFile(path + "/count.txt") && interaction.member.id != readFile(path + "/lastMessage.txt")) {
            interaction.react('✅').catch(console.error)
            let count = parseInt(readFile(path + "/count.txt"))
            count++;
            writeToFile(path + "/count.txt", count.toString())
            writeToFile(path + "/lastMessage.txt", interaction.member.id)
        } else if (interaction.member.id == readFile(path + "/lastMessage.txt")) {
            interaction.reply("Same author, reseting back to 0.")
            interaction.react("❌")
            let count = parseInt(readFile(path + "/count.txt"))
            count = 0;
            writeToFile(path + "/count.txt", count.toString())
            writeToFile(path + "/lastMessage.txt", "")
        } else {
            interaction.reply("Wrong number, reseting back to 0.")
            interaction.react("❌")
            let count = parseInt(readFile(path + "/count.txt"))
            count = 0;
            writeToFile(path + "/count.txt", count.toString())
            writeToFile(path + "/lastMessage.txt", "")
        }
    }
}