const { SlashCommandBuilder, EmbedBuilder, Embed, IntegrationApplication } = require("discord.js");
const fs = require("fs");
const { readFile, writeToFile } = require("../utils/fileUtils");
require("../utils/embedData.js")
const levelCard = require("../utils/levelCard");

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
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Change the border and progress bar color of your card.')
                        .setRequired(false)    
                )
        ),
    description: 'Settings for your server.',
    usage: '/settings [view|checkmark|visible] [true|false]',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        if (!fs.existsSync(path)) return await interaction.reply({ content: "Your server is not setup yet. Use `/setuphelp` for more information.", ephemeral: true });
        if (interaction.options.getSubcommand() == 'view') { // VIEW ALL SETTINGS
            const settings = JSON.parse(readFile(path + "settings.json"));
            const embed = new EmbedBuilder()
                .setTitle('Settings')
                .setDescription('Here is a list of all available settings:')
                .addFields({ name: 'Checkmark', value: `Change whether the bot should react to all messages sent in your counting channel. \nCurrently set to \`${settings.checkmark}\`` },
                    { name: 'Visible', value: `Change whether the server should be visible on the built-in leaderboards. \nCurrently set to \`${settings.show}\`` })
            embed.addData(embed, interaction)
            await interaction.reply({embeds:[embed]})
        } else if (interaction.options.getSubcommand() == 'checkmark') { // CHECKMARK SETTING
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
        } else if (interaction.options.getSubcommand() == 'visible') { // SERVER VISIBILITY SETTINGS
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
        } else if (interaction.options.getSubcommand() == 'levelcard') { // LEVELCARD SETTINGS
            const theme = interaction.options.get('theme');
            const color = interaction.options.get('color');
            const data = JSON.parse(readFile(path + "scores.json"))
            const users = data.users;
            const user = users.find(x => x.id == interaction.member.id.toString())
            const userIndex = users.indexOf(user);
                
            if (!user.settings) { user.settings = {levelcard: {theme: 'dark', color: '#011d45'}} }
            const settings = user.settings;
            if (!theme && !color) { // If no arguments are present
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Levelcard')
                    .setDescription(`Change the appearence of your level card.
                    Theme: \`${settings.levelcard.theme}\`
                    Color: \`${settings.levelcard.color}\``)
                embed.addData(embed, interaction)
                await interaction.reply({embeds:[embed]})
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Settings - Levelcard')
                embed.addData(embed, interaction)
                let description = 'Change the appearence of your level card.'
                if (theme != undefined) {
                    settings.levelcard.theme = theme.value;
                    description = description + `\nLevelcard theme is now set to \`${theme.value}\``
                }
                if (color != undefined) {
                    if (color.value.startsWith("#") && (color.value.length == 7 || color.value.length == 4)) {
                        settings.levelcard.color = color.value;
                        description = description + `\nLevelcard color is now set to \`${color.value}\``
                    } else {
                        description = description + `\nInvalid color code. Hex code needed.`
                    }
                }
                embed.setDescription(description);
                const userData = interaction.guild.members.cache.get(user.id).user
                console.log(settings)

                user.settings = settings;
                users[userIndex] = user;
                data.users = users;
                writeToFile(path + "scores.json", JSON.stringify(data));
                const imageCanvas = levelCard.generate(user, userData, data, settings);
                await interaction.reply({embeds:[embed], files: [await imageCanvas]});
            }
        }
    }
} 