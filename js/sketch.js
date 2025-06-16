const blobs = {};
const abbyBlobs = [];
const abbyCounter = 4;

function createBlob(id) {
  const gradient = document.createElement('div');
  gradient.className = 'gradients-container';
  gradient.id = `blob-${id}`;

  // Generate random opacities for each gradient
  const alphas = Array.from({ length: 6 }, () => Math.random().toFixed(2)); // ["0.73", "0.12", ..., "0.89"]

  gradient.innerHTML = `
    <div class="g1" style="background: radial-gradient(circle at center, rgba(var(--color1), ${alphas[0]}) 0, rgba(var(--color1), 0) 50%) no-repeat;"></div>
    <div class="g2" style="background: radial-gradient(circle at center, rgba(var(--color2), ${alphas[1]}) 0, rgba(var(--color2), 0) 50%) no-repeat;"></div>
    <div class="g3" style="background: radial-gradient(circle at center, rgba(var(--color3), ${alphas[2]}) 0, rgba(var(--color3), 0) 50%) no-repeat;"></div>
    <div class="g4" style="background: radial-gradient(circle at center, rgba(var(--color4), ${alphas[3]}) 0, rgba(var(--color4), 0) 50%) no-repeat;"></div>
    <div class="g5" style="background: radial-gradient(circle at center, rgba(var(--color5), ${alphas[4]}) 0, rgba(var(--color5), 0) 50%) no-repeat;"></div>
    <div class="g6" style="background: radial-gradient(circle at center, rgba(var(--color6), ${alphas[5]}) 0, rgba(var(--color6), 0) 50%) no-repeat;"></div>
  `;

  document.getElementById('gradient-bg').appendChild(gradient);
  return gradient;
}

function updateBlobPositions() {
  const poses = typeof getLatestPoses === 'function' ? getLatestPoses() : [];

  // Cleanup: Remove blobs for undetected people
  Object.keys(blobs).forEach(id => {
    if (!poses[id]) {
      blobs[id].gradient.remove();
      delete blobs[id];
    }
  });

  poses.forEach((pose, i) => {
    const id = i.toString();
    if (!blobs[id]) {
      blobs[id] = {
        gradient: createBlob(id),
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0
      };
    }

    const nose = tracker.findKeypoint('nose', pose);

    if (nose && nose.score > tracker.minScore) {
      const blob = blobs[id];

      const targetX = tracker.scaleX(nose.x);
      const targetY = tracker.scaleY(nose.y);

      blob.x += (targetX - blob.x) * 1;
      blob.y += (targetY - blob.y) * 1;

      const dx = blob.x - blob.prevX;
      const dy = blob.y - blob.prevY;
      blob.prevX = blob.x;
      blob.prevY = blob.y;

      const stretchX = 1 + Math.min(Math.abs(dx) / 50, 0.5);
      const stretchY = 1 + Math.min(Math.abs(dy) / 50, 0.5);

      blob.gradient.style.transform = `
        translate(${2 * blob.x}px, ${2 * blob.y}px)
        scale(${stretchX}, ${stretchY})
      `;
    }
  });
}

function createAbbyBlob(i) {
  const abbyGradient = document.createElement('div');
  abbyGradient.className = 'gradients-container-abby';
  abbyGradient.id = `abby-blob-${i}`;

  const alphas = Array.from({ length: 6 }, () => (Math.random() * 0.2 + 0.1).toFixed(2));
  abbyGradient.innerHTML = `
    <div class="g1" style="background: radial-gradient(circle at center, rgba(var(--color1), ${alphas[0]}) 0, rgba(var(--color1), 0) 50%) no-repeat;"></div>
    <div class="g2" style="background: radial-gradient(circle at center, rgba(var(--color2), ${alphas[1]}) 0, rgba(var(--color2), 0) 50%) no-repeat;"></div>
    <div class="g3" style="background: radial-gradient(circle at center, rgba(var(--color3), ${alphas[2]}) 0, rgba(var(--color3), 0) 50%) no-repeat;"></div>
    <div class="g4" style="background: radial-gradient(circle at center, rgba(var(--color4), ${alphas[3]}) 0, rgba(var(--color4), 0) 50%) no-repeat;"></div>
    <div class="g5" style="background: radial-gradient(circle at center, rgba(var(--color5), ${alphas[4]}) 0, rgba(var(--color5), 0) 50%) no-repeat;"></div>
    <div class="g6" style="background: radial-gradient(circle at center, rgba(var(--color6), ${alphas[5]}) 0, rgba(var(--color6), 0) 50%) no-repeat;"></div>
  `;

  abbyGradient.style.position = 'absolute';
  abbyGradient.style.zIndex = '0';
  abbyGradient.style.pointerEvents = 'none';
  abbyGradient.style.opacity = '0.7';

  const size = Math.random() * 200 + 300;
  abbyGradient.style.width = `${size}px`;
  abbyGradient.style.height = `${size}px`;

  // const halfSize = size / 2;

  const x = Math.random() * (window.innerWidth - size);
  const y = Math.random() * (window.innerHeight - size);

  // abbyGradient.style.left = '0px';
  // abbyGradient.style.top = '0px';

  document.getElementById('gradient-bg').appendChild(abbyGradient);

  return {
    gradient: abbyGradient,
    x,
    y,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    size,
  };
}

function updateAbbyBlobs() {
  abbyBlobs.forEach(blob => {
    blob.x += blob.dx;
    blob.y += blob.dy;

    // Clamp within viewport
    if (blob.x < 0 || blob.x + blob.size > window.innerWidth) {
      blob.dx *= -1;
      blob.x = Math.max(0, Math.min(blob.x, window.innerWidth - blob.size));
    }
    if (blob.y < 0 || blob.y + blob.size > window.innerHeight) {
      blob.dy *= -1;
      blob.y = Math.max(0, Math.min(blob.y, window.innerHeight - blob.size));
    }

    blob.gradient.style.transform = `translate(${blob.x}px, ${blob.y}px)`;
  });
}

function initAbbyBlobs() {
  for (let i = 0; i < abbyCounter; i++) {
    abbyBlobs.push(createAbbyBlob(i));
  }
}


function loop() {
  updateBlobPositions();
  updateAbbyBlobs();
  requestAnimationFrame(loop);
}

function setup () {
  initAbbyBlobs();
  loop();
}

setup();


