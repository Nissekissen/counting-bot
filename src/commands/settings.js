const { SlashCommandBuilder, EmbedBuilder, Embed, IntegrationApplication } = require("discord.js");
const fs = require("fs");
const { readFile, writeToFile } = require("../utils/fileUtils");
require("../utils/embedData.js")
const levelCard = require("../utils/images/levelCard");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Settings for your server.')
        .setDMPermission(false),
    description: 'Settings for your server.',
    usage: '/settings [view|checkmark|visible] [true|false]',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        const subcommand = require(`../subcommands/${this.data.name}/${interaction.options.getSubcommand()}`);
        const permissions = subcommand.permissions;
        if (permissions.length > 0) {
            if (!interaction.member.permissions.has(permissions)) {
                return await interaction.reply({ content: 'You do not have permission to execute this subcommand.', ephemeral: true })
            }
        }
        if (!fs.existsSync(path)) return await interaction.reply({ content: "Your server is not setup yet. Use `/setuphelp` for more information.", ephemeral: true });
        await subcommand.execute(interaction, path);
    }
} 