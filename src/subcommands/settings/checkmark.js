const { writeToFile, readFile } = require("../../utils/fileUtils");
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'Checkmark',
    command: 'settings',
    register(builder) {
        return builder.addSubcommand(subcommand => 
            subcommand.setName('checkmark')
                .setDescription('Change whether the bot should react to all messages sent in your counting channel.')
                .addStringOption(option => 
                    option.setName('checkmark')
                        .setDescription('Set this to "true" or "false"')
                        .setRequired(false)
                        .addChoices({ name: 'True', value: 'true'}, { name: 'False', value: 'false' })
                )
        )
    },
    description: 'Change whether the bot should react to all messages sent in your counting channel.',
    permissions: [PermissionFlagsBits.ManageGuild],
    async execute(interaction, path) {
        const settings = JSON.parse(readFile(path + "settings.json"));
        const embed = new EmbedBuilder()
            .setTitle('Settings - Visible')
        let description = this.description;
        if (!interaction.options.get('checkmark')) {
            description = description + `\nCurrently set to \nCurrently set to \`${settings.checkmark}\``
        } else {
            settings.checkmark = true ? interaction.options.get('checkmark').value == 'true' : false;
            description = description + `\nSetting is now set to \`${settings.checkmark}\``
        }
        embed.addData(embed, interaction);
        embed.setDescription(description);
        writeToFile(path + 'settings.json', JSON.stringify(settings));
        await interaction.reply({embeds:[embed]})
    }
}