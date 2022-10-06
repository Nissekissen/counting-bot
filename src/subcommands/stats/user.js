const { readFile } = require("../../utils/fileUtils")

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
        console.log("test");
    }

}