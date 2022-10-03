const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const { readFile } = require("../utils/fileUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('View the level of a server member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to view.')
                .setRequired(false)    
        ),
    description: 'View the level of a server member.',
    usage: '/level @username',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`
        const data = JSON.parse(readFile(path + "scores.json"))
        let user;
        if (!interaction.options.get('user')) {
            user = data.users.find(x => x.id == interaction.member.id.toString())
        } else {
            user = data.users.find(x => x.id == interaction.options.get('user').value.toString())
        }
        if (!user) {
            const embed = new EmbedBuilder()
                .setTitle('Level')
            embed.addData(embed, interaction)
            if (!interaction.options.get('user')) {
                embed.setDescription(`You haven't counted yet!`)
            } else {
                embed.setDescription(`User <@${interaction.options.get('user').value.toString()}> hasn't counted`)
            }
            await interaction.reply({embeds: [embed]})
            return;
        }
        const userData = interaction.guild.members.cache.get(user.id).user

        const embed = new EmbedBuilder()
            .setTitle('Level - ' + userData.username)
            .addFields({ name: `Level ${user.level.toString()}`, value: `Total score: ${user.score.toString()}\nTotal messages: ${user.messages.toString()}` })
            .setThumbnail(userData.displayAvatarURL({ dynamic: true, size: 128 }))
        embed.addData(embed, interaction)
        await interaction.reply({embeds:[embed]})
    }
}