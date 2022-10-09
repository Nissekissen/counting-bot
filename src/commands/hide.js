const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs")
const { readFile, writeToFile } = require("../utils/fileUtils");
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hide')
        .setDescription('Makes the server invisible on the leaderboards.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    description: 'Makes the server invisible on the built-in leaderboards.',
    usage: '/hide',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        if (!fs.existsSync(path)) {
            await interaction.reply({content: "Your server is not setup yet. Use </setup:907924863866507264> to setup the bot.", ephemeral: true})
            return;
        }
        let data = {checkmark: true, visible: true};
        if (fs.existsSync(path + "settings.json")) {
            data = JSON.parse(readFile(path + "settings.json"))
        }
        let visible = data.visible;
        if (!visible) {
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("This server is already invisible on the leaderboards.")
            embed.addData(embed, interaction)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            data.visible = false;
            writeToFile(path + "settings.json", JSON.stringify(data));
            const embed = new EmbedBuilder()
                .setTitle("Show settings")
                .setDescription("Server is now invisible on the leaderboards.")
            embed.addData(embed, interaction)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}