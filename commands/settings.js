const { SlashCommandBuilder, EmbedBuilder, Embed, IntegrationApplication } = require("discord.js");
const fs = require("fs");
const { readFile } = require("../utils/fileUtils");
require("../utils/embedData.js")

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
        )
        .addSubcommand(subcommand =>
            subcommand.setName('levelcard')
                .setDescription('Change the appearence of the level card.')
                .addStringOption(option => 
                    option.setName('theme')
                        .setDescription('Change the theme of the level card.')
                        .setRequired(false)
                        .addChoices({ name: 'Light', value: 'light' }, { name: 'Dark', value: 'dark' })
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
            embed.addData(embed, interaction)
            await interaction.reply({embeds:[embed]})
        } else if (interaction.options.getSubcommand() == 'checkmark') {
            if (!interaction.options.get('checkmark')) {
                const settings = JSON.parse(readFile(path + "settings.json"));
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should react to all messages sent in your counting channel. \nCurrently set to \`${settings.checkmark}\``)
                embed.addData(embed, interaction)
                await interaction.reply({embeds:[embed]})
            } else {
                const settings = JSON.parse(readFile(path + "settings.json"));
                settings.checkmark = true ? interaction.options.get('checkmark').value == 'true' : false;
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should react to all messages sent in your counting channel. \nSetting is now set to \`${settings.checkmark}\``)
                embed.addData(embed, interaction)
                await interaction.reply({embeds:[embed]})
            }
        } else if (interaction.options.getSubcommand() == 'visible') {
            if (!interaction.options.get('visible')) {
                const settings = JSON.parse(readFile(path + "settings.json"));
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should be visible on the built-in leaderboards. \nCurrently set to \`${settings.show}\``)
                embed.addData(embed, interaction)
                await interaction.reply({embeds:[embed]})
            } else {
                const settings = JSON.parse(readFile(path + "settings.json"));
                settings.show = true ? interaction.options.get('visible').value == 'true' : false;
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Visible')
                    .setDescription(`Change whether the bot should be visible on the built-in leaderboards. \nSetting is now set to \`${settings.show}\``)
                embed.addData(embed, interaction)
                await interaction.reply({embeds:[embed]})
            }
        } else if (interaction.options.getSubcommand() == 'levelcard') {
            const theme = interaction.options.get('theme');
            const color = interaction.options.get('color');
            if (!theme && !color) {
                const users = JSON.parse(readFile(path + "scores.json")).users;
                const user = users.find(x => x.id == interaction.member.id.toString())
                
                if (!user.settings) { user.settings = {levelcard: {theme: 'dark', color: '#011d45'}} }
                const settings = user.settings;
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Levelcard')
                    .setDescription(`Change the appearence of your level card.
                    Theme: ${settings.levelcard.theme}
                    Color: ${settings.levelcard.color}`)
                embed.addData(embed, interaction)
                await interaction.reply({embeds:[embed]})
            }
        }
    }
} 