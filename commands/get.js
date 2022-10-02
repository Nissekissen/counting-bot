const { SlashCommandBuilder, EmbedBuilder, IntegrationApplication } = require("discord.js");
const { readFile } = require("../utils/fileUtils");
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription('Returns the current count.'),
    description: 'Returns the current count.',
    usage: '/get',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`
        const count = readFile(path + 'count.txt');
        const embed = new EmbedBuilder()
            .setTitle("Current Count")
            .setDescription("Current count: " + count)
        embed.addData(embed, interaction)
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}