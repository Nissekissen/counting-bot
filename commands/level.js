const { SlashCommandBuilder, EmbedBuilder, MessageAttachment, AttachmentBuilder } = require("discord.js");
const { readFile } = require("../utils/fileUtils");
const ProgressBar = require("../utils/imageDrawer/progressbar");
const UserAvatar = require("../utils/imageDrawer/userAvatar");
const images = require('images');

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
        const Canvas = require('canvas');
        const canvas = Canvas.createCanvas(256,128);
        const ctx = canvas.getContext('2d');
        const progressBar = new ProgressBar({
            x: 20,
            y: 93,
            width: 216,
            height: 25,

        }, "#00aaff", user.score/(100 * (Math.pow(2, user.level) - 1)) * 100, ctx);
        progressBar.draw();
        console.log(userData.displayAvatarURL({ extension: "jpg" }));
        const userAvatar = new UserAvatar({x: 10, y: 10, width: 64, height: 64}, userData.displayAvatarURL({ extension: "jpg" }), ctx);
        userAvatar.draw();
        const image = canvas.toDataURL('image/png');
        const sfbuff = new Buffer.from(image.split(",")[1], "base64");
        const sfattach = new AttachmentBuilder(sfbuff, "output.png");
        const embed = new EmbedBuilder()
            .setTitle('Level - ' + userData.username)
            .addFields({ name: `Level ${user.level.toString()}`,
                value: `Total score: ${user.score.toString()}
                Score needed for next level: ${(100 * (Math.pow(2, user.level) - 1)) - user.score}
                Total messages: ${user.messages.toString()}`
             })
            .setThumbnail(userData.displayAvatarURL({ dynamic: true, size: 128 }))
            
        embed.addData(embed, interaction)
        await interaction.reply({embeds:[embed], files: [sfattach]})
    }
}