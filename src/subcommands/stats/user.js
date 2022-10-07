const { readFile } = require("../../utils/fileUtils")
const userStats = require("../../utils/images/userStats")

module.exports = {
    command: 'stats',
    register(builder) {
        return builder.addSubcommand(subcommand =>
            subcommand.setName('user')
                .setDescription('Shows stats about a user.')
        )
    },
    description: 'Shows stats about this server.',
    async execute(interaction, path) {
        const data = JSON.parse(readFile(path + "scores.json"))
        let user;
        if (!data.users) {
            data = {users: []}
        }
        user = data.users.find(x => x.id == interaction.member.id.toString())
        if (!user) {
            user = {
                id: interaction.member.id,
                score: 0,
                level: 1,
                messages: 0
            }
            data.users.push(user);
        }
        const userId = interaction.member.id;
        const userData = interaction.guild.members.cache.get(userId).user;
        
        const imageCanvas = userStats.generate(user, userData, data, user.settings)
        await interaction.reply({files: [await imageCanvas]})
    }

}