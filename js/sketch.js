let img;
let emitters = [];

function preload() {
  img = loadImage('./img/texture32.png'); // flame orb image
}

function setup() {
  const canvasElement = document.querySelector('.app_p5js-canvas');

  // Use p5.js with existing canvas element
  let canvas = createCanvas(canvasElement.clientWidth, canvasElement.clientHeight);
  canvas.elt = canvasElement; // attach the p5 renderer to the existing canvas
  canvas.drawingContext = canvasElement.getContext('2d');

  blendMode(ADD);
}

function draw() {
  clear();
  background(0, 0, 0, 30);

  const poses = typeof getLatestPoses === 'function' ? getLatestPoses() : [];

  // Ensure emitter count matches tracked people
  while (emitters.length < poses.length) {
    emitters.push(new Emitter(width / 2, height / 2));
  }

  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i];
    const nose = tracker.findKeypoint('nose', pose);
    if (nose && nose.score > tracker.minScore) {
      const x = tracker.scaleX(nose.x);
      const y = tracker.scaleY(nose.y);
      emitters[i].setPosition(x, y);
    }

    emitters[i].emit(2);
    emitters[i].applyForce(createVector(0, -0.02));
    emitters[i].update();
    emitters[i].show();
  }
}