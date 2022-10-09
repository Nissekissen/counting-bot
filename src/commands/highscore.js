const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const fs = require("fs")
const { readFile } = require("../utils/fileUtils")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('highscore')
        .setDescription('Shows the highest score ever reached on this server.')
        .setDMPermission(false),
    description: 'Shows the highest score ever reached on this server.',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`
        if (!fs.existsSync(path)) { return await interaction.reply({ content: "Your server is not setup yet. Use `/setuphelp` for more information." }) }

        const highscore = readFile(path + "highscore.txt");
        const embed = new EmbedBuilder()
            .setTitle("Server highscore")
            .setDescription(`The highscore for \`${interaction.guild.name}\` is currently \`${highscore}\``)
        embed.addData(embed, interaction)
        await interaction.reply({embeds: [embed]})
    }
}