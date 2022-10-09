const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const { writeToFile } = require("../utils/fileUtils");
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the bot")
        .addChannelOption(option => 
                option.setName('channel')
                    .setDescription('The counting channel')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    description: 'Setup the counting channel. Do `/setuphelp` for more information and help.',
    usage: '/setuphelp <channel>',
    async execute(interaction) {
        if (fs.existsSync(`./servers/${interaction.guildId}/`)) {
            const embed = new EmbedBuilder()
                .setTitle("Setup")
                .setDescription("Your server is already setup.")
                .setColor("#00aaff")
                .setFooter({ text: "Made by REEEEEEEboi#6089" })
            embed.addData(embed, interaction)
            await interaction.reply({ embeds: [embed] })
        } else {
            if (!fs.existsSync("./servers/")) { fs.mkdirSync("./servers") }
            fs.mkdirSync(`./servers/${interaction.guildId}`);
            let path = `./servers/${interaction.guildId}/`;
            writeToFile(path + "channel.txt", interaction.options.get('channel').value);
            writeToFile(path + "count.txt", "0");
            writeToFile(path + "lastMessage.txt", "");
            writeToFile(path + "highscore.txt", "0")
            let settings = JSON.stringify({visible: true, checkmark: true})
            writeToFile(path + "settings.json", settings)
            writeToFile(path + "scores.json", '{users: []}');
            const embed = new EmbedBuilder()
                .setTitle("Setup")
                .setDescription(`Successfully set \`#${interaction.client.channels.cache.get(interaction.options.get('channel').value).name}\` as the counting channel.`)
                .setFooter({ text: "Made by REEEEEEEboi#6089" })
                .setColor("#00aaff")

            await interaction.reply({ embeds: [embed] })
        }
    }
} 