const CanvasBuilder = require('../imageDrawer/canvasBuilder');

module.exports = {
    async generate(user, userData, data, settings) {
        let colorThemes = {
            dark:  { background: "#36393f", border: "#00aaff", text: { main: "#fff", under: "#eee", par: "#bbb" } },
            light: { background: "#fff", border: "#00aaff", text: { main: "#000", under: "#111", par: "#333" } }
        }
        let colors = colorThemes.dark;
        if (settings) {
            if (settings.levelcard.theme == 'light') {
                colors = colorThemes.light;
            }
            colors.border = settings.levelcard.color;
        }
        const canvas = new CanvasBuilder(300, 104, "#33363A", colors.background);

        canvas.drawText(110, 30, colors.text.main, 15, `${userData.username} - stats`);
        canvas.drawText(110, 45, colors.text.under, 13, `Score: ${user.score}`)
        canvas.drawText(210, 45, colors.text.under, 13, `Level: ${user.level}`)
        canvas.drawText(110, 60, colors.text.under, 13, `Messages sent: ${user.messages}`)
        canvas.ctx.strokeStyle = colors.border;
        canvas.ctx.lineWidth = 3;
        canvas.ctx.beginPath()
        canvas.ctx.moveTo(97, 10);
        canvas.ctx.lineTo(97, 94);
        canvas.ctx.stroke();
        console.log(userData.username);

        await canvas.addImage(userData.displayAvatarURL({ extension: "jpg" }), 20, 20, 64, 64, true);
        return canvas.getCanvas();
    }
}