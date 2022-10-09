//All logging should be directed to this file instead of using console.log

module.exports = {
    log(text) {
        const date = new Date();
        const meta = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} @ ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - `;
        return console.log(meta + text);
    }
}