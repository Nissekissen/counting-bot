const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'Visible',
    command: 'settings',
    register(builder) {
        return builder.addSubcommand(subcommand => 
            subcommand.setName('visible')
                .setDescription('Change whether the server should be visible on the built-in leaderboards.')
                .addStringOption(option => 
                    option.setName('visible')
                        .setDescription('Set this to "true" or "false"')
                        .setRequired(false)
                        .addChoices({ name: 'True', value: 'true'}, { name: 'False', value: 'false' })
                )
        )
    },
    description: 'Change whether the server should be visible on the built-in leaderboards.',
    permissions: [PermissionFlagsBits.ManageGuild],
    async execute(interaction, path) {
        const settings = JSON.parse(readFile(path + "settings.json"));
        const embed = new EmbedBuilder()
            .setTitle('Settings - Visible')
        let description = this.description;
        if (!interaction.options.get('visible')) {
            description = description + `\nCurrently set to \nCurrently set to \`${settings.checkmark}\``
        } else {
            settings.show = true ? interaction.options.get('visible').value == 'true' : false;
            description = description + `\nSetting is now set to \`${settings.checkmark}\``
        }
        embed.addData(embed, interaction);
        embed.setDescription(description);
        writeToFile(path + 'settings.json', JSON.stringify(settings));
        await interaction.reply({embeds:[embed]})
    }
}