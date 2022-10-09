const { SlashCommandBuilder, EmbedBuilder, IntegrationApplication } = require("discord.js");
const { readFile } = require("../utils/fileUtils");
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('Returns the current count.')
        .setDMPermission(false),
    description: 'Returns the current count.',
    usage: '/score',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`
        const count = readFile(path + 'count.txt');
        const embed = new EmbedBuilder()
            .setTitle("Current Score")
            .setDescription(`The highscore for \`${interaction.guild.name}\` is currently \`${count}\``)
        embed.addData(embed, interaction)
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}