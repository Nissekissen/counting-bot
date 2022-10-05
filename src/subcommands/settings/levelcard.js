const { writeToFile, readFile } = require("../../utils/fileUtils");
const { EmbedBuilder } = require('discord.js')
const levelCard = require('../../utils/levelCard')

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
        const data = JSON.parse(readFile(path + "scores.json"))
        const users = data.users;
        const user = users.find(x => x.id == interaction.member.id.toString())
        const userIndex = users.indexOf(user);
        
        if (!user.settings) { user.settings = {levelcard: {theme: 'dark', color: '#00aaff'}} }
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