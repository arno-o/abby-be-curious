const blobs = {};

function createBlob(id) {
  const el = document.createElement('div');
  el.className = 'gradients-container';
  el.id = `blob-${id}`;
  el.innerHTML = `
    <div class="g1"></div>
    <div class="g2"></div>
    <div class="g3"></div>
    <div class="g4"></div>
    <div class="g5"></div>
    <div class="g6"></div>
  `;
  document.getElementById('gradient-bg').appendChild(el);
  return el;
}

function updateBlobPositions() {
  const poses = typeof getLatestPoses === 'function' ? getLatestPoses() : [];

  // Cleanup: Remove blobs for undetected people
  Object.keys(blobs).forEach(id => {
    if (!poses[id]) {
      blobs[id].el.remove();
      delete blobs[id];
    }
  });

  poses.forEach((pose, i) => {
    const id = i.toString();
    if (!blobs[id]) {
      blobs[id] = {
        el: createBlob(id),
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

      blob.el.style.transform = `
        translate(${2.5* blob.x}px, ${2.5 * blob.y}px)
        scale(${stretchX}, ${stretchY})
      `;
    }
  });
}


function loop() {
  updateBlobPositions();
  requestAnimationFrame(loop);
}

loop();
