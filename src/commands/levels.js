const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readFile } = require("../utils/fileUtils");

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
        .setName('levels')
        .setDescription('Shows the top 5 people with the highest level in your server.')
        .setDMPermission(false),
    description: 'Shows the top 5 people with the highest level and score in your server.',
    usage: '/levels',
    async execute(interaction) {
        const path = `./servers/${interaction.guildId}/`;
        const users = JSON.parse(readFile(path + "scores.json")).users;
        let user_data = []
        users.forEach(user => {
            user_data.push([user.score, user.level, user.id]);
        });
        user_data.sort(sortFunction);
        const embed = new EmbedBuilder()
            .setTitle('Top levels')
            .setDescription('Here are the top server members with the highest score:')
        
        let iterations = user_data.length ? user_data.length < 5 : 5;
        for (let i = 0; i < iterations; i++) {
            let user = interaction.guild.members.cache.get(user_data[i][2]);
            embed.addFields({
                name: `${(i + 1).toString()}. ${user.user.username}`,
                value: `Level ${user_data[i][1]}
                    Total score: ${user_data[i][0]}`
            });
        }
        embed.addData(embed, interaction)
        await interaction.reply({embeds:[embed]})
    }
}