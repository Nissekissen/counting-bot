const fs = require("fs");
const { parse } = require("path");
const { readFile, writeToFile } = require("../utils/fileUtils");
const logger = require("../utils/logger");
const levelUp = require('./levelUp')

module.exports = {
    name: 'messageCreate',
    async execute(interaction) {
        if (interaction.member.id == interaction.client.application.id) return;
        let path = `./servers/${interaction.guildId}`
        if (!fs.existsSync(path)) return;
        if (interaction.content.startsWith(";")) { return await interaction.reply({ content: "I now work with slash commands! Do /help for more information!", ephemeral: true }) }
        if (interaction.channelId != readFile(path + "/channel.txt")) return;
        const checkmark = true;
        if (fs.existsSync(path + "/settings.json")) {
            checkmark = JSON.parse(readFile(path + "/settings.json")).checkmark
        }
        if (!checkmark) writeToFile(path + "settings.json", JSON.stringify({visible: true, checkmark: true}));
        if (interaction.content == readFile(path + "/count.txt") && interaction.member.id != readFile(path + "/last_message.txt")) {
            //Update count file
            if (checkmark) interaction.react('✅')
            let count = parseInt(readFile(path + "/count.txt"))
            count++;
            writeToFile(path + "/count.txt", count.toString())
            writeToFile(path + "/last_message.txt", interaction.member.id)
            writeToFile(path + "/highscore.txt", count.toString());

            //Update score file
            if (!fs.existsSync(path + "/scores.json")) writeToFile(path + "/scores.json", JSON.stringify({ users: []}))
            const data = JSON.parse(readFile(path + "/scores.json"));
            let user = data.users.find(x => x.id == interaction.member.id.toString())
            if (!user) {
                user = {
                    id: interaction.member.id,
                    score: 0,
                    level: 1,
                    messages: 0
                }
            }
            user.score += (Math.floor(Math.random() * 10) + 5)
            user.messages += 1;
            const newLevel = 100 * (Math.pow(2, user.level) - 1);
            if (user.score > newLevel) {
                await levelUp.execute(interaction, user);
                user.level++;
            }
            let index = data.users.map(function(e) { return e.id; }).indexOf(user.id)
            if (index == -1) {
                data.users.push(user)
            } else {
                data.users[index] = user;
            }
            writeToFile(path + "/scores.json", JSON.stringify(data))
            logger.log(`Counted in server "${interaction.guild.name}"`)
        } else if (interaction.member.id == readFile(path + "/last_message.txt")) {
            interaction.reply("Same author, reseting back to 0.")
            if (checkmark) interaction.react("❌")
            let count = parseInt(readFile(path + "/count.txt"))
            count = 0;
            writeToFile(path + "/count.txt", count.toString())
            writeToFile(path + "/last_message.txt", "")
        } else {
            interaction.reply("Wrong number, reseting back to 0.")
            if (checkmark) interaction.react("❌")
            let count = parseInt(readFile(path + "/count.txt"))
            count = 0;
            writeToFile(path + "/count.txt", count.toString())
            writeToFile(path + "/last_message.txt", "")
        }
    }
}