const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readFile, writeToFile } = require("../utils/fileUtils");
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('Makes the server visible on the leaderboards'),
    description: 'Makes the server visible on the built-in leaderboards. This is set to true as a default.',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        if (!fs.existsSync(path)) {
            await interaction.reply({content: "Your server is not setup yet. Use `/setup` to setup the bot.", ephemeral: true})
            return;
        }
        let show = readFile(path + "show.txt");
        if (show == 1) {
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("This server is already visible on the leaderboards.")
                .setColor('#00aaff')
                .setFooter({text:"Made by REEEEEEEboi#6089"})
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            writeToFile(path + "show.txt", "1")
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("Server is now visible on the leaderboards.")
                .setColor('#00aaff')
                .setFooter({text:"Made by REEEEEEEboi#6089"})
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }
        
    }
}