const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const { writeToFile } = require("../utils/fileUtils");
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setchannel")
        .setDescription("Change the counting channel.")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel you want to change to.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    description: 'Set/change the current counting channel.',
    usage: '/setchannel <channel>',
    async execute(interaction) {
        let path = `./servers/${interaction.guildId}/`
        if (!fs.existsSync(path)) {
            await interaction.reply({ embeds: [new EmbedBuilder()
                .setTitle("Set Channel")
                .setDescription("Your server is not setup. Use `/setup` to setup the bot.")
                .setColor("#00aaff")
                .setFooter("Made by REEEEEEEboi#6089")
            ] })
            return;
        }
        writeToFile(path + "channel.txt", interaction.options.get('channel').value)
        const embed = new EmbedBuilder()
            .setTitle("Setup")
            .setDescription(`Successfully set \`#${interaction.client.channels.cache.get(interaction.options.get('channel').value).name}\` as the counting channel.`)
        embed.addData(embed, interaction)
        await interaction.reply({ embeds: [embed] })
    }
}