const { SlashCommandBuilder, EmbedBuilder, MessageAttachment, AttachmentBuilder } = require("discord.js");
const { readFile, writeToFile } = require("../utils/fileUtils");
const ProgressBar = require("../utils/imageDrawer/progressbar");
const UserAvatar = require("../utils/imageDrawer/userAvatar");
const images = require('images');
const CanvasBuilder = require("../utils/imageDrawer/canvasBuilder");
const fs = require("fs");
const levelCard = require("../utils/images/levelCard");
const sort = require('../utils/sort');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('View the level of a server member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to view.')
                .setRequired(false)    
        )
        .setDMPermission(false),
    description: 'View the level of a server member.',
    usage: '/level @username',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`
        if (!fs.existsSync(path)) return await interaction.reply({ content: "This server isn't setup yet! Use /setuphelp for more info", ephemeral: true });
        let data = {users: []}
        if (fs.existsSync(path + "scores.json")) data = JSON.parse(readFile(path + "scores.json"))
        data.users.sort(sort);
        let user;
        if (!interaction.options.get('user')) { 
            user = data.users.find(x => x.id == interaction.member.id.toString())
        } else {
            user = data.users.find(x => x.id == interaction.options.get('user').value.toString())
        }
        if (!user) {
            user = {
                id: interaction.member.id,
                score: 0,
                level: 1,
                messages: 0
            }
            if (interaction.options.get('user')) {
                user.id = interaction.options.get('user').value;
            }
            data.users.push(user);
        }
        writeToFile(path + "scores.json", JSON.stringify(data));
        const userData = interaction.guild.members.cache.get(user.id).user
        const imageCanvas = levelCard.generate(user, userData, data, user.settings);
        await interaction.reply({files: [await imageCanvas]})
    }
}