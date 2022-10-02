const { EmbedBuilder, Embed } = require('discord.js')


module.exports = EmbedBuilder.prototype.addData = (embed, interaction) => {
    embed.setColor("#00aaff")
    .setFooter({ text: 'Made by REEEEEEEboi#6089' })
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
}