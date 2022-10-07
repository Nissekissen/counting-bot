const { readFile } = require("../../utils/fileUtils")
const fs = require('fs');
const sort = require('../../utils/sort');
const { EmbedBuilder, IntegrationApplication } = require("discord.js");

module.exports = {
    command: 'stats',
    register(builder) {
        return builder.addSubcommand(subcommand =>
            subcommand.setName('server')
                .setDescription('Shows stats about this server.')
        )
    },
    description: 'Shows stats about this server.',
    async execute(interaction, path) {
        const count = parseInt(readFile(path + 'count.txt'));
        const highscore = parseInt(readFile(path + 'highscore.txt'));
        let guild_data = []
        interaction.client.guilds.cache.forEach(guild => {
            let serverPath = `./servers/${guild.id}/`
            if (fs.existsSync(serverPath)) {
                let count = readFile(serverPath + "count.txt")
                let visible = JSON.parse(readFile(serverPath + "settings.json")).visible;
                guild_data.push([parseInt(count), guild.id, visible]);
            }
        });
        guild_data.sort(sort);
        for (let i = 0; i < guild_data.length; i++) {
            if (guild_data[i][2] == "0") {
                guild_data.splice(i, 1);
                i--;
            }
        }
        const rank = guild_data.findIndex(x => x[1] == interaction.guildId.toString()) + 1
        const icon = interaction.guild.iconURL();
        const users = JSON.parse(readFile(path + 'scores.json')).users;
        let totalMessages = 0;
        users.forEach(user => {
            totalMessages += parseInt(user.messages);
        })
        console.log(icon)
        const embed = new EmbedBuilder()
            .setTitle('Server stats - ' + interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: `Current score: ${count}`, value: '\u200b', inline: true },
                { name: `Highscore: ${highscore}`, value: '\u200b', inline: true },
                { name: `Server rank: #${rank}`, value: '\u200b', inline: true },
                { name: `Messages sent: ${totalMessages}`, value: '\u200b', inline: true }
                )
        embed.addData(embed, interaction)
        await interaction.reply({embeds: [embed]})
    }

}