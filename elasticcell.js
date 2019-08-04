
// symbiotic
var balls = [];

// i don't know ahead of time the radius of the cell, which i find exciting

function setup() {
  var c = createCanvas(600, 600);
  c.parent('container');

	let n = 17;
	for (let i = 0; i < n; i++) {
		balls.push(new Ball(width/2+100*Math.cos(360/n*i*PI/180), height/2+100*Math.sin(360/n*i*PI/180), 0, 0, 7));
	}


}

function draw() {
  background(51);
	
	fill(255, 201, 0, 200);
	text("each ball is attracted to every other ball thu hookes law", 50, 50);
	text("the balls have arranged themselves into a shape themselves - change n to see the shapes", 50, 70);
	text("you can click and drag a ball", 50, 90);
	text("each ball does 2d elastic collisions with the other balls if they collide", 50, 110);
	text("i think this could be an nice stepping stone for sthing neat", 50, 130);
	
	let c = calculateCenterAndRadius();
	stroke(100, 100, 100, 120);
	strokeWeight(4);
	point(c.x, c.y);
	noFill();
	strokeWeight(1);
	ellipse(c.x, c.y, c.r*2, c.r*2);
	
	
	for (let i = 0; i < balls.length; i++) {
		//balls[i].pull(c);
		balls[i].update();
		balls[i].show();
		balls[i].drag();
		balls[i].collideWithEdge();
		for (let j = 0; j < balls.length; j++) {
			balls[i].attract(balls[j]);
		}
		for (let j = i+1; j < balls.length; j++) {
			balls[i].collideWith(balls[j]);
		}

	}

}


class Ball {
	
	constructor(x, y, vx, vy, r) {
		this.r = r;
		this.x = x;
		this.y = y;
		this.m = 2*PI*r*r;
		this.vx = vx;
		this.vy = vy;
		this.w = 0; // angular speed
		this.wmax = 5;
		this.w0 = 0;
		this.ax = 0;
		this.ay = 0;
		this.clicked = false;
		this.k = 0.00001;
	}
	
	show() {
		noStroke();
		fill(255, 201, 0, 160);
		ellipse(this.x, this.y, this.r*2, this.r*2);
	}
	
	update() {
		this.vx *= 0.95;
		this.vy *= 0.95;
		
		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
		
		this.ax = 0;
		this.ay = 0;
		
	}

	drag() {
		// if any ball is already clicked, then no other can be clicked  !! add this, and then add - if i click ont he page i add acceleration to each of the balls
		
		let allCirclesAreUnclicked = true;
		
		for (let i = 0; i < balls.length; i++) {
			if (balls[i].clicked) {
				allCirclesAreUnclicked = false;
			}
		}
		
		let d = dist(this.x, this.y, mouseX, mouseY);
		if (mouseIsPressed && d < this.r && allCirclesAreUnclicked) {
			this.clicked = true;
		}
		if (this.clicked && !mouseIsPressed) {
			this.clicked = false;
		}
		if (this.clicked) {
			this.x = mouseX;
			this.y = mouseY;
		}
	}
	
	pull(c) {
		
		
		let d = dist(mouseX, mouseY, c.x, c.y);
		
		if (mouseIsPressed && d > c.r) {
			
			this.ax += -0.000005*(mouseX - this.x)*Math.abs(mouseX - this.x);
			this.ay += -0.000005*(mouseY - this.y)*Math.abs(mouseY - this.y);
		}
	}
	
	attract(other) {
			let d = dist(this.x, this.y, other.x, other.y);
			let dx = this.x - other.x;
			let dy = this.y - other.y;
			let force = -this.k*(d-100); // if d = 50, there is no force
			this.ax += dx * force;
			this.ay += dy * force;
	}
	
	collideWithEdge() {
		if (this.x + this.r >= width) {
			let d = this.x + this.r - width;
			this.x = width - d - this.r;
			this.vx *= -1;
		}
		if (this.x - this.r <= 0) {
			this.x = this.r;
			this.vx *= -1;
		}
		if (this.y + this.r >= height) {
			let d = this.y + this.r - height;
			this.y = height - d - this.r;
			this.vy *= -1;
		}
		if (this.y - this.r <= 0) {
			this.y = this.r;
			this.vy *= -1;
		}
	}

	collideWith(other) {
		recalcMomentumAfterCollision(this, other);
	}

}

function calculateCenterAndRadius() {
	let cx = 0;
	let cy = 0;
	let r = 0;
	
	for (let i = 0; i < balls.length; i++) {
	  cx += balls[i].x;
		cy += balls[i].y;
	}
	cx /= balls.length;
	cy /= balls.length;
	
	for (let i = 0; i < balls.length; i++) {
	  let d = dist(balls[i].x, balls[i].y, cx, cy);
		if (d > r) {
			r = d;
		}
	}
	
	return {
		'x': cx,
		'y': cy,
		'r': r*1.2
	}
	
}
