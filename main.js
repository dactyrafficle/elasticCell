var n = 7;
var balls = [];

function setup() {
  var c = createCanvas(600, 600);
  c.parent('container');
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			let r = random(12, 21);
			//let x = random(r, width-r);
			//let y = random(r, height-r);
			let x = (width/n)*(i+0.5);
			let y = (height/n)*(j+0.5);	
			balls.push(new Ball(x, y, r));
		}
	}
	console.log(balls);
}

function draw() {
  background(51);
	for (let i = 0; i < balls.length; i++) {
		balls[i].update();
		balls[i].collideWithEdge();
		
		// collision test
		for (let j = i+1; j < balls.length; j++) {
			balls[i].collideWith(balls[j]);
		}
		balls[i].display();
	}
}

function Ball(x, y, r) {
	this.r = r;
	this.x = x;
	this.y = y;
	this.m = 2*PI*r*r;
	this.vx = random(-3, 3);
	this.vy = random(-3, 3);
}

Ball.prototype.update = function() {
	this.x += this.vx;
	this.y += this.vy;
}
Ball.prototype.display = function() {
	noStroke();
	fill(255, 180, 0, 120);
	ellipse(this.x, this.y, this.r*2, this.r*2);
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
