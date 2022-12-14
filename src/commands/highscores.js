const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { readFile } = require("../utils/fileUtils");
require("../utils/embedData.js")
const sort = require('../utils/sort')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('highscores')
        .setDescription('Shows a list of the top 5 server highscores.')
        .setDMPermission(false),
    description: 'Shows a list of the top 5 server highscores.',
    usage: '/highscores',
    async execute(interaction) {
        let guild_data = []
        interaction.client.guilds.cache.forEach(guild => {
            let path = `./servers/${guild.id}/`
            if (fs.existsSync(path)) {
                if (!fs.existsSync(path + "settings.json")) writeToFile(path + "settings.json", JSON.stringify({visible: true, checkmark: true}));
                let count = readFile(path + "highscore.txt")
                let visible = true;
                if (!fs.existsSync(path + "settings.json")) visible = JSON.parse(readFile(path + "settings.json")).visible;
                guild_data.push([parseInt(count), guild.id, visible]);
            }
        });
        guild_data.sort(sort);
        const embed = new EmbedBuilder()
            .setTitle("Leaderboard")
            .setDescription("Here are the top servers with the highest count:");
        for (let i = 0; i < guild_data.length; i++) {
            if (guild_data[i][2] == "0") {
                guild_data.splice(i, 1);
                i--;
            }
        }
        
        if (guild_data.length < 5) {
            for (let i = 0; i < guild_data.length; i++) {
                let guild = interaction.client.guilds.cache.get(guild_data[i][1])
                embed.addFields({ name: `${(i + 1).toString()}. ` + guild.name, value: guild_data[i][0].toString() });
            }
        } else {
            for (let i = 0; i < 5; i++) {
                let guild = interaction.client.guilds.cache.get(guild_data[i][1])
                embed.addFields({ name: `${(i + 1).toString()}. ` + guild.id, value: guild_data[i][0].toString() });
            }
        }
        embed.addData(embed, interaction)
        await interaction.reply({ embeds: [embed] })
    }
}