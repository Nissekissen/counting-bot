const { createCanvas, loadImage, registerFont } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const { request } = require('undici');

class CanvasBuilder {
    constructor(w, h, borderColor, backgroundColor) {
        this.w = w;
        this.h = h;
        this.backgroundColor = backgroundColor;
        this.canvas = createCanvas(w, h);
        this.ctx = this.canvas.getContext('2d');
        if (backgroundColor) {
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, w, h);
        }
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(0, 0, w, h);
    }

    async addImage(URL, x, y, w, h, circle) {
        const image = await loadImage(URL)
        if (circle) { //width and height must be the same for this to work
            this.ctx.beginPath();
            this.ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.clip();
        }
        this.ctx.drawImage(image, x, y, w, h);
        
    }
    
    drawText(x, y, color, size, text) {
        registerFont('./fonts/verdana-bold.ttf', { family: 'Verdana bold' })
        this.ctx.font = size.toString() + 'px "Verdana bold"';
        this.ctx.fillStyle = color;

        this.ctx.fillText(text, x, y);
    }

    async getCanvas() {
        return new AttachmentBuilder(this.canvas.createPNGStream(), { name: `level-image.png` });
    }
}

module.exports = CanvasBuilder;