class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(0.3);
    this.acc = createVector(0, 0);
    this.r = 25;
    this.lifetime = 255;
  }

  finished() {
    return this.lifetime < 0;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.lifetime -= 7;
  }

  show() {
    tint(35, 40, 80, this.lifetime);
    imageMode(CENTER);
    image(img, this.pos.x, this.pos.y, this.r, this.r);
  }
}