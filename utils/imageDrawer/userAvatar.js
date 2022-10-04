const { loadImage } = require('@napi-rs/canvas')

class UserAvatar {
    constructor(dimension, url, ctx) {
        ({x: this.x, y: this.y, width: this.w, height: this.h} = dimension);
        this.url = url;
        this.ctx = ctx;
    }

    draw() {
        loadImage(this.url).then((image) => {
            this.ctx.drawImage(image, this.x, this.y, this.w, this.h);
        })
    }

}

module.exports = UserAvatar;