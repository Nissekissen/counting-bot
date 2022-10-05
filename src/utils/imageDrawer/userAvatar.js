const { Image } = require('@napi-rs/canvas');
const { promises } = require('fs');

class UserAvatar {
    constructor(dimension, url, ctx) {
        ({x: this.x, y: this.y, width: this.w, height: this.h} = dimension);
        this.url = url;
        this.ctx = ctx;
        this.image = new Image();
    }

}

module.exports = UserAvatar;