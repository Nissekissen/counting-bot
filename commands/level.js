const { SlashCommandBuilder, EmbedBuilder, MessageAttachment, AttachmentBuilder } = require("discord.js");
const { readFile } = require("../utils/fileUtils");
const ProgressBar = require("../utils/imageDrawer/progressbar");
const UserAvatar = require("../utils/imageDrawer/userAvatar");
const images = require('images');
const CanvasBuilder = require("../utils/imageDrawer/canvasBuilder");

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
        if (!user) { // When either server isn't setup or user object doesn't exist
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
        const canvas = new CanvasBuilder(256, 128, "#011d45");
        const progressBar = new ProgressBar({
            x: 20,
            y: 103,
            width: 216,
            height: 15,

        }, "#00aaff", user.score/(100 * (Math.pow(2, user.level) - 1)) * 100, canvas.ctx);
        progressBar.draw();
        canvas.drawText(100, 30, "#fff", 15, userData.username);
        canvas.drawText(100, 47, "#eee", 13, `Level ${user.level}`);
        canvas.drawText(100, 65, "#bbb", 10, `Total score: ${user.score}`);
        canvas.drawText(100, 80, "#bbb", 10, `Score to next level: ${(100 * (Math.pow(2, user.level) - 1)) - user.score}`);
        canvas.drawText(100, 95, "#bbb", 10, `Total messages: ${user.messages.toString()}`);
        
        await canvas.addImage(userData.displayAvatarURL({ extension: "jpg" }), 20, 10, 64, 64, true);
        await interaction.reply({files: [await canvas.getCanvas()]})
    }
}