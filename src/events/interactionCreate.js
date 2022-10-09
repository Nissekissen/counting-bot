const { InteractionType } = require('discord.js')
const logger = require('../utils/logger')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
                logger.log(`User "${interaction.member.user.username}" in "${interaction.guild.name}" ran command "${interaction.commandName}"`)
            } catch (error) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
                logger.log(error)
            }
        }    
    }
}