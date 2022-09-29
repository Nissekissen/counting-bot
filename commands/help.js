const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { execute } = require("./setup");
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands.')
        .addStringOption(option => 
            option.setName('command')
                .setDescription("The command to view (optional)")
                .setRequired(false)),
    description: 'Shows this message.',
    async execute(interaction) {
        if (!interaction.options.get('command')) {
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            const embed = new EmbedBuilder()
                .setTitle('Help')
                .setDescription('Here is a list of available commands:')
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                embed.addFields({ name: `\`/${command.data.name}\``, value: command.description, inline: true })            
            }
            embed.setColor('#00aaff')
            embed.setFooter({ text: "Type /help <command> for more info on a command." })
            await interaction.reply({ embeds: [embed] })
        }
    }
}