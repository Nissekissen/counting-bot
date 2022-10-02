const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const { readFile, writeToFile } = require("../utils/fileUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hide')
        .setDescription('Makes the server invisible on the leaderboards.'),
    description: 'Makes the server invisible on the built-in leaderboards.',
    usage: '/hide',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        if (!fs.existsSync(path)) {
            await interaction.reply({content: "Your server is not setup yet. Use `/setup` to setup the bot.", ephemeral: true})
            return;
        }
        let data = JSON.parse(readFile(path + "settings.json"))
        let show = data.show;
        if (!show) {
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("This server is already invisible on the leaderboards.")
                .setColor('#00aaff')
                .setFooter({text:"Made by REEEEEEEboi#6089"})
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            data.show = false;
            writeToFile(path + "settings.json", JSON.stringify(data));
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("Server is now invisible on the leaderboards.")
                .setColor('#00aaff')
                .setFooter({text:"Made by REEEEEEEboi#6089"})
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }
        
    }
}