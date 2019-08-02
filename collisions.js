function headOnCollision(m1, v1, m2, v2) {
  let v4 = (2*m1/(m1+m2))*v1 - ((m1-m2)/(m1+m2))*v2
  let v3 = ((m1-m2)/(m1+m2))*v1 + (2*m2/(m1+m2))*v2
  return {
    'v3': v3,
    'v4': v4
  };
}

function proj12(x1_x, x1_y, x2_x, x2_y) {
  var obj = {
    x: 0,
    y: 0
  }
  let k1 = x1_x*x2_x + x1_y*x2_y;
  let k2 = x2_x*x2_x + x2_y*x2_y;
  let k = k1/k2;
  obj.x = k*x2_x;
  obj.y = k*x2_y;
  return obj;
}

function ortho12(x1_x, x1_y, x2_x, x2_y) {
  var obj1 = proj12(x1_x, x1_y, x2_x, x2_y);
  var obj2 = {};
  obj2.x = x1_x - obj1.x;
  obj2.y = x1_y - obj1.y;
  return obj2;
}

// needs 2 objects, each with x, y, vx, vy, r, m
function recalcMomentumAfterCollision(b1, b2) {
	
  let d = dist(b1.x, b1.y, b2.x, b2.y);
  let rho = b1.r + b2.r;
	
  if (d > rho) {	
    // do nothing
    return;
  } else {

    // 1. get the normal vector, N, that represents the line of collision
    let N = new Vector(b1.x-b2.x, b1.y-b2.y);
		
    let N1 = new Vector(b1.x - b2.x, b1.y - b2.y);
		console.log(N1.theta());
		
    let N2 = new Vector(b2.x - b1.x, b2.y - b1.y);
		console.log(N2.theta());

    // 1b. reposition b1 so that it is exactly rho units away from b2 in the direction of the line of collision, N
    b1.x = b2.x + (N.x/N.mag())*rho;
    b1.y = b2.y + (N.y/N.mag())*rho;
    
    // animating the line of collision
    stroke(255, 0, 0);
    strokeWeight(2);
    line(b1.x, b1.y, b2.x, b2.y);
		
    // 2. get the projections of v1 and v2 onto the normal
	
    // each returns an object
    let projV1onN = proj12(b1.vx, b1.vy, N.x, N.y);
    let projV2onN = proj12(b2.vx, b2.vy, N.x, N.y);
		
    // 3. calculate the head on collision - break it up into x- and y-collisions since this is alone N

    // in: m1, v1x, v1y, m2, v2x, v2y (basically, mass + 2 vectors in)
    // out: v3x, v3y, v4x, v4y (2 vectors out)
		
    let v3_normalX = headOnCollision(b1.m, projV1onN.x, b2.m, projV2onN.x).v3;
    let v4_normalX = headOnCollision(b1.m, projV1onN.x, b2.m, projV2onN.x).v4;
		
    let v3_normalY = headOnCollision(b1.m, projV1onN.y, b2.m, projV2onN.y).v3;
    let v4_normalY = headOnCollision(b1.m, projV1onN.y, b2.m, projV2onN.y).v4;
		
    // 4. calculate the orthogonal components
		
    // each returns an object
    let aa = ortho12(b1.vx, b1.vy, N.x, N.y);
		let orthoV1onN = new Vector(aa.x, aa.y);
		console.log(orthoV1onN.theta());
		
    let bb = ortho12(b2.vx, b2.vy, N.x, N.y);
		let orthoV2onN = new Vector(bb.x, bb.y);
		console.log(orthoV2onN.theta());
		
		/* calc the spin */

    // 4b. the size of the orthogonal vector will determine how much spin to give - but i also need to analyze i think the angle between the orthogonal and the normal to establish what direction it will be in, bc right now, it's just arbitrary
		
		// if the orthogonal component has a smaller angle than the normal, it imparts a counter clockwise spin on the other ball, else clockwise
		
		let spin2 = (function() {
			if (N1.theta() > orthoV1onN.theta()) {
			  return -1;
			} else {
				return 1;
			}
		})();
		
		let spin1 = (function() {
			if (N2.theta() > orthoV2onN.theta()) {
			  return -1;
			} else {
				return 1;
			}
		})();
		
    // b1 adds angular momentum to b2
    let v1_ortho_mag = orthoV1onN.mag();
    let b1_angular_momentum = b1.m * v1_ortho_mag;
		
    // b2 adds angular momentum to b1		
    let v2_ortho_mag = orthoV2onN.mag();
    let b2_angular_momentum = b2.m * v2_ortho_mag;
		
    b1.w += spin1*b2_angular_momentum/b1.m;
    b2.w += spin2*b1_angular_momentum/b2.m;		

		
		

    // 5. combine results from step 3 and 4
		
    v3x = v3_normalX + orthoV1onN.x;
    v3y = v3_normalY + orthoV1onN.y;
		
    v4x = v4_normalX + orthoV2onN.x;
    v4y = v4_normalY + orthoV2onN.y;
		
    b1.vx = v3x;
    b1.vy = v3y;
		
    b2.vx = v4x;
    b2.vy = v4y;
		
		//noLoop();
  
  }
}


function Vector(x, y) {
  this.x = x;
  this.y = y;
	this.theta = function() {
		let a = Math.atan2(-this.y, this.x)*180/PI;
		if (a < 0) {
			a += 360;
		}
		return a;
	}
  this.mag = function() {
    return Math.sqrt(this.x*this.x+this.y*this.y);
  };
  this.normalize = function() {
    let m = this.mag();
    this.x = this.x / m;
    this.y = this.y / m;
    console.log('x: ' + this.x + ', y: ' + this.y);
  };
}
