const { SlashCommandBuilder, EmbedBuilder, IntegrationApplication } = require("discord.js");
const { readFile } = require("../utils/fileUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription('Returns the current count.'),
    description: 'Returns the current count.',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`
        const count = readFile(path + 'count.txt');
        const embed = new EmbedBuilder()
            .setTitle("Current Count")
            .setDescription("Current count: " + count)
            .setColor('#00aaff')
            .setFooter({text: "Made by REEEEEEEboi#6089"});
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}