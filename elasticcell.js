

var elasticCells = [];

// i need a binary to see if ANY balls are clicked before I can click and drag any of them
var allCirclesAreUnclicked = true;



function setup() {
  var c = createCanvas(600, 600);
  c.parent('container');

  elasticCells[0] = new ElasticCell(width/2, height/2, 17, 7, {r:255, g:201, b:0, a:160});
  elasticCells[1] = new ElasticCell(width/4, height/4, 17, 7, {r:120, g:220, b:170, a:160});
	elasticCells[2] = new ElasticCell(width*3/4, height/4, 17, 7, {r:90, g:90, b:220, a:160});
	
}

function draw() {
  background(51);
	
	// reset every frame
	allCirclesAreUnclicked = true;
	
	/*
	fill(255, 201, 0, 200);
	text("each ball is attracted to every other ball thu hookes law", 50, 50);
	text("the balls have arranged themselves into a shape themselves - change n to see the shapes", 50, 70);
	text("you can click and drag a ball", 50, 90);
	text("each ball does 2d elastic collisions with the other balls if they collide", 50, 110);
	text("i think this could be an nice stepping stone for sthing neat", 50, 130);
	*/
	
	for (let i = 0; i < elasticCells.length; i++) {
		elasticCells[i].show();
		for (let j = 0; j < elasticCells.length; j++) {
      elasticCells[i].collideWithOtherElasticCells(elasticCells[j]);
      elasticCells[i].repelOtherElasticCells(elasticCells[j]);			
		}
		
	}

	
}






class ElasticCell {
	constructor(x, y, n, r_outer, color) {
		this.x = x;
		this.y = y;
		this.n = n;
		this.r_outer = r_outer;
		this.balls = [];
    for (let i = 0; i < n; i++) {
      this.balls.push(new Ball(x+100*Math.cos(360/n*i*PI/180), y+100*Math.sin(360/n*i*PI/180), 0, 0, r_outer, color));
	  }	
	}

	show() {

		/*
		let c = calculateCenterAndRadius();
		stroke(100, 100, 100, 120);
		strokeWeight(4);
		point(c.x, c.y);
		noFill();
		strokeWeight(1);
		ellipse(c.x, c.y, c.r*2, c.r*2);
		*/
		
		for (let i = 0; i < this.balls.length; i++) {
			//balls[i].pull(c);
			this.balls[i].update();
			this.balls[i].show();
			this.balls[i].drag(this.balls);
			this.balls[i].collideWithEdge();
			for (let j = 0; j < this.balls.length; j++) {
				this.balls[i].attract(this.balls[j]);
			}
			for (let j = i+1; j < this.balls.length; j++) {
				this.balls[i].collideWith(this.balls[j]);
			}

		}
		
	}
	
	collideWithOtherElasticCells(other) {
		for (let i = 0; i < this.balls.length; i++) {
			for (let j = i+1; j < other.balls.length; j++) {
				this.balls[i].collideWith(other.balls[j]);
			}

		}		
	}
	
	repelOtherElasticCells(other) {
		for (let i = 0; i < this.balls.length; i++) {
			for (let j = i+1; j < other.balls.length; j++) {
				this.balls[i].repel(other.balls[j]);
			}

		}		
	}
	
	
	
}


class Ball {
	
	constructor(x, y, vx, vy, r, color) {
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
		this.red = color.r;
		this.green = color.g;
		this.blue = color.b;
		this.alpha = color.a;
	}
	
	show() {
		noStroke();
		fill(this.red, this.green, this.blue, this.alpha);
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

	drag(balls) {
		// if any ball is already clicked, then no other can be clicked  !! add this, and then add - if i click ont he page i add acceleration to each of the balls
		

		
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
	
	repel(other) {
			let d = dist(this.x, this.y, other.x, other.y);
			let dx = this.x - other.x;
			let dy = this.y - other.y;
			
			// normal vector
			let nx = dx/d;
			let ny = dy/d;
			
			let scale = 0.3;
			let force = -scale*1/d; // if d = 50, there is no force
			
			if (d < width/2) {
			  this.ax -= nx * force;
			  this.ay -= ny * force;
			}
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
