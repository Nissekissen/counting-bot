const { writeToFile, readFile } = require("../../utils/fileUtils");
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')
const levelCard = require('../../utils/images/levelCard')
const fs = require('fs');
const logger = require("../../utils/logger");

module.exports = {
    name: 'Levelcard',
    command: 'settings',
    register(builder) {
        return builder.addSubcommand(subcommand =>
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
        )
    },
    description: 'Change the appearence of your level card.',
    async execute(interaction, path) {
        const theme = interaction.options.get('theme');
        const color = interaction.options.get('color');
        logger.log("test");
        let data = "{}"
        if (fs.existsSync(path + "scores.json")) {
            data = JSON.parse(readFile(path + "scores.json"))
        }
        if (JSON.stringify(data) == "{}") { data = {users: []} };
        const users = data.users;
        let user = data.users.find(x => x.id == interaction.member.id.toString())
        if (!user) {
            user = {
                id: interaction.member.id,
                score: 0,
                level: 1,
                messages: 0
            }
        }
        const userIndex = users.findIndex(x => x.id == interaction.member.id.toString());
        
        if (!user.settings) { user.settings = {levelcard: {theme: 'dark', color: '#00aaff'}} }
        const settings = user.settings;
        const embed = new EmbedBuilder()
            .setTitle('Settings - Levelcard')
        let description = 'Change the appearence of your level card.'
        embed.addData(embed, interaction)
        const userData = interaction.guild.members.cache.get(user.id).user;
        if (!theme && !color) { // If no arguments are present
            description += `\nTheme: \`${settings.levelcard.theme}\`
                Color: \`${settings.levelcard.color}\``
        } else {
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
                console.log("test")
            }
            user.settings = settings;
            users[userIndex] = user;
            data.users = users;
            writeToFile(path + "scores.json", JSON.stringify(data));
        }
        embed.setDescription(description);
        const imageCanvas = levelCard.generate(user, userData, data, settings);
        await interaction.reply({embeds:[embed], files: [await imageCanvas]});
    }
}