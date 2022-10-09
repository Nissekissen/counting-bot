const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs")
require("../utils/embedData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands.')
        .addStringOption(option => 
            option.setName('command')
                .setDescription("The command to view (optional)")
                .setRequired(false))
        .setDMPermission(false),
    description: 'Shows this message.',
    usage: '/help <command>',
    async execute(interaction) {
        if (!interaction.options.get('command')) {
            const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
            const embed = new EmbedBuilder()
                .setTitle('Help')
                .setDescription('Here is a list of available commands:')
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                embed.addFields({ name: `\`/${command.data.name}\``, value: command.description, inline: true })            
            }
            embed.addData(embed, interaction)
            await interaction.reply({ embeds: [embed] })
        } else {
            const commandName = interaction.options.get('command').value;
            const command = require(`./${commandName}.js`)
            const embed = new EmbedBuilder()
                .setTitle('Help')
                .addFields({ name: `${command.data.name}`, value: command.description })
                .addFields({ name: 'Usage:', value: `\`${command.usage}\`` })
            embed.addData(embed, interaction)
            await interaction.reply({embeds: [embed]})
        }
    }
}