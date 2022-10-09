const { SlashCommandBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows user or server statistics.')
        .setDMPermission(false),
    description: 'Shows user or server statistics.',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        const subcommand = require(`../subcommands/${this.data.name}/${interaction.options.getSubcommand()}`);
        if (!fs.existsSync(path)) return await interaction.reply({ content: "Your server is not setup yet. Use `/setuphelp` for more information.", ephemeral: true });
        await subcommand.execute(interaction, path);
    }
}