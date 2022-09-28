module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log('Bot started')
        client.user.setPresence({ activities: [{ name: 'people count...' , type: 'WATCHING'}], status: 'online' })
    }
}