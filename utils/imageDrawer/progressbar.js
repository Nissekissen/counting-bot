class ProgressBar {

  constructor(dimension, color, percentage, ctx){
    ({x: this.x, y: this.y, width: this.w, height: this.h} = dimension);
    this.color = color;
    this.percentage = percentage / 100;
    this.p;
    this.ctx = ctx;
  }
  
  static clear(){
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);  
  }
  
  draw(){
    // Visualize -------
    this.visualize();
    // -----------------
    this.p = this.percentage * this.w;
    if(this.p <= this.h){
      this.ctx.beginPath();
      this.ctx.arc(this.h / 2 + this.x, this.h / 2 + this.y, this.h / 2, Math.PI - Math.acos((this.h - this.p) / this.h), Math.PI + Math.acos((this.h - this.p) / this.h));
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.arc((this.h / 2) - this.p - this.x, this.h / 2 + this.y, this.h / 2, Math.PI - Math.acos((this.h - this.p) / this.h), Math.PI + Math.acos((this.h - this.p) / this.h));
      this.ctx.restore();
      this.ctx.closePath();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.h / 2 + this.x, this.h / 2 + this.y, this.h / 2, Math.PI / 2, 3 / 2 *Math.PI);
      this.ctx.lineTo(this.p - this.h + this.x, 0 + this.y);
      this.ctx.arc(this.p - (this.h / 2) + this.x, this.h / 2 + this.y, this.h / 2, 3 / 2 * Math.PI, Math.PI / 2);
      this.ctx.lineTo(this.h / 2 + this.x, this.h + this.y);
      this.ctx.closePath();
    }
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
  
  visualize(){
    this.showWholeProgressBar();
  }

  showWholeProgressBar(){
    this.ctx.beginPath();
    this.ctx.arc(this.h / 2 + this.x, this.h / 2 + this.y, this.h / 2, Math.PI / 2, 3 / 2 * Math.PI);
    this.ctx.lineTo(this.w - this.h + this.x, 0 + this.y);
    this.ctx.arc(this.w - this.h / 2 + this.x, this.h / 2 + this.y, this.h / 2, 3 / 2 *Math.PI, Math.PI / 2);
    this.ctx.lineTo(this.h / 2 + this.x, this.h + this.y);
    this.ctx.strokeStyle = '#000000';
    this.ctx.stroke();
    this.ctx.closePath();
  }
  
  get PPercentage(){
    return this.percentage * 100;
  }
  
  set PPercentage(x){
    this.percentage = x / 100;
  }
  
}

module.exports = ProgressBar;