var n = 7;
var balls = [];

function setup() {
  var c = createCanvas(600, 600);
   c.parent('container');
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let r = random(12, 21);
      let x = (width/n)*(i+0.5);
      let y = (height/n)*(j+0.5);	
      let vx = random(-3, 3);
      let vy = random(-3, 3);
      //balls.push(new Ball(x, y, vx, vy, r));
    }
  }
	
  let v = 7;
	
  let r1 = 30;
  let r2 = 30;
  balls.push(new Ball(width/2, height/2, 0, 0, r1));
  balls.push(new Ball(width/2+(r1+r2)*0.9, height-r2, 0, -v, r2));
	
  let r3 = 18;
  let r4 = 18;
  balls.push(new Ball(0+r3, height*1/5, v*0.7, 0, r3));
  balls.push(new Ball(width-r4, height*1/5+(r3+r4)*0.9, -v*0.7, 0, r4));
	
}

function draw() {
  background(51);
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].collideWithEdge();
		
    for (let j = i+1; j < balls.length; j++) {
      balls[i].collideWith(balls[j]);
    }
    balls[i].display();
  }
}

function Ball(x, y, vx, vy, r) {
  this.r = r;
  this.x = x;
  this.y = y;
  this.m = 2*PI*r*r;
  this.vx = vx;
  this.vy = vy;
  this.w = 0; // angular speed
  this.wmax = 5;
  this.w0 = 0;
	this.a = 190;
}

Ball.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
  if (this.w > this.wmax) {
    this.w = this.wmax;
  }
  if (this.w < -this.wmax) {
    this.w = -this.wmax;
  }
  this.w0 += this.w/180*PI;
}

Ball.prototype.display = function() {
	
  push();
	
    noStroke();
    translate(this.x, this.y);
    rotate(this.w0);
    fill(100, 145, 240, this.a);
    arc(0, 0, this.r*2, this.r*2, 0+PI, 0);
    fill(255, 205, 255, this.a);
    arc(0, 0, this.r*2, this.r*2, 0, 0+PI);
		
    strokeWeight(this.r/4);
    stroke(100, 145, 240, this.a);
    point(this.r*0.7*Math.sin(0*PI/180), this.r*0.7*Math.cos(0*PI/180));
	
  pop();
	
}

Ball.prototype.collideWithEdge = function() {
  if (this.x + this.r >= width) {
    this.x = width - this.r;
    this.vx *= -1;
  }
  if (this.x - this.r <= 0) {
    this.x = this.r;
    this.vx *= -1;
  }
  if (this.y + this.r >= height) {
    this.y = height - this.r;
    this.vy *= -1;
  }
  if (this.y - this.r <= 0) {
    this.y = this.r;
    this.vy *= -1;
  }
}

Ball.prototype.collideWith = function(other) {
  recalcMomentumAfterCollision(this, other);
}
