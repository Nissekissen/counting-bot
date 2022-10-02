const { SlashCommandBuilder, EmbedBuilder, Embed, IntegrationApplication } = require("discord.js");
const fs = require("fs");
const { readFile } = require("../utils/fileUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Settings for your server.')
        .addSubcommand(subcommand =>
            subcommand.setName('view')
                .setDescription('View all your settings.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('checkmark')
                .setDescription('Change whether the bot should react to all messages sent in your counting channel.')
                .addStringOption(option => 
                    option.setName('checkmark')
                        .setDescription('Set this to "true" or "false"')
                        .setRequired(false)
                        .addChoices({ name: 'True', value: 'true'}, { name: 'False', value: 'false' })
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('visible')
                .setDescription('Change whether the server should be visible on the built-in leaderboards.')
                .addStringOption(option => 
                    option.setName('visible')
                        .setDescription('Set this to "true" or "false"')
                        .setRequired(false)
                        .addChoices({ name: 'True', value: 'true'}, { name: 'False', value: 'false' })
                )
        ),
    description: 'Settings for your server.',
    usage: '/settings [view|checkmark|visible] [true|false]',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        if (!fs.existsSync(path)) return await interaction.reply({ content: "Your server is not setup yet. Use `/setuphelp` for more information.", ephemeral: true });
        if (interaction.options.getSubcommand() == 'view') {
            const settings = JSON.parse(readFile(path + "settings.json"));
            const embed = new EmbedBuilder()
                .setTitle('Settings')
                .setDescription('Here is a list of all available settings:')
                .addFields({ name: 'Checkmark', value: `Change whether the bot should react to all messages sent in your counting channel. \nCurrently set to \`${settings.checkmark}\`` },
                    { name: 'Visible', value: `Change whether the server should be visible on the built-in leaderboards. \nCurrently set to \`${settings.show}\`` })
                .setColor('#00aaff')
                .setFooter({text:"Made by REEEEEEEboi#6089"})
            await interaction.reply({embeds:[embed]})
        } else if (interaction.options.getSubcommand() == 'checkmark') {
            if (!interaction.options.get('checkmark')) {
                const settings = JSON.parse(readFile(path + "settings.json"));
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should react to all messages sent in your counting channel. \nCurrently set to \`${settings.checkmark}\``)
                    .setColor("#00aaff")
                    .setFooter({text:"Made by REEEEEEEboi#6089"})
                await interaction.reply({embeds:[embed]})
            } else {
                const settings = JSON.parse(readFile(path + "settings.json"));
                settings.checkmark = true ? interaction.options.get('checkmark').value == 'true' : false;
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should react to all messages sent in your counting channel. \nSetting is now set to \`${settings.checkmark}\``)
                    .setColor("#00aaff")
                    .setFooter({text:"Made by REEEEEEEboi#6089"})
                await interaction.reply({embeds:[embed]})
            }
        } else if (interaction.options.getSubcommand() == 'visible') {
            if (!interaction.options.get('visible')) {
                const settings = JSON.parse(readFile(path + "settings.json"));
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should be visible on the built-in leaderboards. \nCurrently set to \`${settings.show}\``)
                    .setColor("#00aaff")
                    .setFooter({text:"Made by REEEEEEEboi#6089"})
                await interaction.reply({embeds:[embed]})
            } else {
                const settings = JSON.parse(readFile(path + "settings.json"));
                settings.show = true ? interaction.options.get('visible').value == 'true' : false;
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should be visible on the built-in leaderboards. \nSetting is now set to \`${settings.show}\``)
                    .setColor("#00aaff")
                    .setFooter({text:"Made by REEEEEEEboi#6089"})
                await interaction.reply({embeds:[embed]})
            }
        }
    }
} 