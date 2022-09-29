const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
const fs = require("fs");
const { writeToFile } = require("../utils/fileUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the bot")
        .addChannelOption(option => 
                option.setName('channel')
                    .setDescription('The counting channel')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)
                    ),
    description: 'Setup the counting channel. Do `/setuphelp` for more information and help.',
    async execute(interaction) {
        if (fs.existsSync(`./servers/${interaction.guildId}/`)) {
            await interaction.reply({ embeds: [new EmbedBuilder()
                                                    .setTitle("Setup")
                                                    .setDescription("Your server is already setup.")
                                                    .setColor("#00aaff")
                                                    .setFooter({ text: "Made by REEEEEEEboi#6089" })
            ] })
        } else {
            if (!fs.existsSync("./servers/")) { fs.mkdirSync("./servers") }
            fs.mkdirSync(`./servers/${interaction.guildId}`);
            let path = `./servers/${interaction.guildId}/`;
            writeToFile(path + "channel.txt", interaction.options.get('channel').value);
            writeToFile(path + "count.txt", "0");
            writeToFile(path + "lastMessage.txt", "");
            await interaction.reply({ embeds: [new EmbedBuilder()
                                                    .setTitle("Setup")
                                                    .setDescription(`Successfully set \`#${interaction.client.channels.cache.get(interaction.options.get('channel').value).name}\` as the counting channel.`)
                                                    .setFooter({ text: "Made by REEEEEEEboi#6089" })
                                                    .setColor("#00aaff")
            ] })
        }
    }
} 