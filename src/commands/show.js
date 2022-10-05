const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readFile, writeToFile } = require("../utils/fileUtils");
const fs = require("fs")
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('Makes the server visible on the leaderboards'),
    description: 'Makes the server visible on the built-in leaderboards. This is set to true as a default.',
    usage: '/show',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        if (!fs.existsSync(path)) {
            await interaction.reply({content: "Your server is not setup yet. Use </setup:907924863866507264> to setup the bot.", ephemeral: true})
            return;
        }
        let data = JSON.parse(readFile(path + "settings.json"));
        let visible = data.visible;
        if (visible) {
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("This server is already visible on the leaderboards.")
            embed.addData(embed, interaction)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            data.visible = true;
            writeToFile(path + "settings.json", JSON.stringify(data));
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("Server is now visible on the leaderboards.")
            embed.addData(embed, interaction)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }
        
    }
}