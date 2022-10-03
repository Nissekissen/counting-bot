const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setuphelp')
        .setDescription('Shows help for setting up the bot.'),
    description: 'Help on setting up the counting channel.',
    usage: '/setuphelp',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Setup Help')
            .setDescription('How to setup the Discord Bot')
            .addFields(
                { name: 'Step 1. Create the counting channel.', value: 'Create the channel you want to use for counting. This channel should not be used for anything else.', inline: true },
                { name: 'Step 2. Set the permissions for the bot.', value: "Make sure the bot can read messages, send messages, add reactions and send embed links. Also make sure that the bot isn't affected by any cooldown", inline: true },
                { name: 'Step 3. Run the command.', value: "Run the command `/setup [CHANNEL]`. To change the counting channel, use `/setchannel [CHANNEL]`", inline: true },
                { name: "What if it still doesn't work?", value: "Report any issues or bugs to REEEEEEEboi#6089. " }
            )
        embed.addData(embed, interaction)
        await interaction.reply({ embeds: [embed] })
    }
}