const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { readFile } = require("../utils/fileUtils");

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the top 5 servers."),
    description: 'Shows the 5 servers with the highest current count.',
    async execute(interaction) {
        let guild_data = []
        interaction.client.guilds.cache.forEach(guild => {
            console.log(guild.name);
            let path = `./servers/${guild.id}/`
            if (fs.existsSync(path)) {
                let count = readFile(path + "count.txt")
                guild_data.push([parseInt(count), guild.id]);
            }
        });
        guild_data.sort(sortFunction);
        const embed = new EmbedBuilder()
            .setTitle("Leaderboard")
            .setDescription("Here are the top servers with the highest count:");
        
        if (guild_data.length < 5) {
            for (let i = 0; i < guild_data.length; i++) {
                let guild = interaction.client.guilds.cache.get(guild_data[i][1])
                embed.addFields({ name: '1. ' + guild.name, value: guild_data[i][0].toString() });
            }
        } else {
            for (let i = 0; i < 5; i++) {
                let guild = interaction.client.guilds.cache.get(guild_data[i][1])
                embed.addFields({ name: '1. ' + guild.id, value: guild_data[i][0].toString() });
            }
        }
        embed.setColor("#00aaff")
        embed.setFooter({ text: "Made by REEEEEEEboi#6089" })
        await interaction.reply({ embeds: [embed] })
    }
}