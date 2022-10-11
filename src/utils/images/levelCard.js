const ProgressBar = require("../imageDrawer/progressbar");
const images = require('images');
const CanvasBuilder = require("../imageDrawer/canvasBuilder");
const logger = require("../logger");

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
        const canvas = new CanvasBuilder(256, 143, colors.border, colors.background);
        const progressBar = new ProgressBar({
            x: 20,
            y: 103,
            width: 216,
            height: 15,

        }, colors.border, (user.score - (100 * (Math.pow(2, user.level - 1) - 1)))/(100 * (Math.pow(2, user.level) - 1)) * 100, canvas.ctx);
        progressBar.draw();
        canvas.drawText(100, 30, colors.text.main, 15, userData.username);
        canvas.drawText(100, 47, colors.text.under, 13, `Level ${user.level}`);
        canvas.drawText(100, 65, colors.text.par, 10, `Total score: ${user.score} / ${(100 * (Math.pow(2, user.level) - 1)).toString()}`);
        canvas.drawText(100, 80, colors.text.par, 10, `Total messages: ${user.messages.toString()}`);
        canvas.drawText(100, 95, colors.text.par, 10, `Server rank: #${(data.users.indexOf(user)+1).toString()} of ${data.users.length.toString()}`);
        canvas.drawText(20, 133, colors.text.par, 10, (100 * (Math.pow(2, user.level-1) - 1)).toString())
        canvas.drawText(220, 133, colors.text.par, 10, (100 * (Math.pow(2, user.level) - 1)).toString())
        await canvas.addImage(userData.displayAvatarURL({ extension: "jpg" }), 20, 10, 64, 64, true);
        logger.log("drew image");
        return canvas.getCanvas();
        
    }
}