const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('../../utils/embedData')
const { readFile } = require('../../utils/fileUtils')
const checkmark = require('./checkmark')
const fs = require('fs')

//This way of loading in the subcommands is just for this single case, does not work in other cases.

module.exports = {
    description: 'Shows a list of the available settings.',
    command: 'settings',
    register(builder) {
        return builder.addSubcommand(subcommand =>
            subcommand.setName('view')
                .setDescription('View all your settings.')
        )
    },
    permissions: [PermissionFlagsBits.ManageGuild],
    async execute(interaction, path) {
        const settings = JSON.parse(readFile(path + "settings.json"));
        const subcommandSettingsFiles = fs.readdirSync('./src/subcommands/settings/')
            .filter(file => file.endsWith('js') && file != 'view.js');
        const subcommandSettings = [];
        subcommandSettingsFiles.forEach(file => {
            const data = require('./' + file)
            console.log(data.name)
            if (file == 'levelcard.js') subcommandSettings.push({ name: data.name, value: `${data.description}\nThis setting is user specific.` })
            else subcommandSettings.push({ name: data.name, value: `${data.description}\nCurrently set to \`${settings[data.name.toLowerCase()]}\`` })
        })
        console.log(subcommandSettings);
        const embed = new EmbedBuilder()
            .setTitle('Settings')
            .setDescription('Here is a list of all available settings:')
        for (let i = 0; i < subcommandSettings.length; i++) {
            embed.addFields(subcommandSettings[i]);
        }
        embed.addData(embed, interaction)
        await interaction.reply({embeds:[embed]})
    }
}