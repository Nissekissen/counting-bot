const { SlashCommandBuilder, EmbedBuilder, MessageAttachment, AttachmentBuilder } = require("discord.js");
const { readFile } = require("../utils/fileUtils");
const ProgressBar = require("../utils/imageDrawer/progressbar");
const UserAvatar = require("../utils/imageDrawer/userAvatar");
const images = require('images');
const CanvasBuilder = require("../utils/imageDrawer/canvasBuilder");
const fs = require("fs");
const levelCard = require("../utils/levelCard");

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

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
        if (!fs.existsSync(path)) return await interaction.reply({ content: "This server isn't setup yet! Use /setuphelp for more info", ephemeral: true });
        const data = JSON.parse(readFile(path + "scores.json"))
        data.users.sort(sortFunction);
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
        console.log(user);
        const imageCanvas = levelCard.generate(user, userData, data, user.settings);
        await interaction.reply({files: [await imageCanvas]})
    }
}