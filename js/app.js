let latestPoses = [];
let $USER_DISTANCE = document.querySelector('#user_distance');
let $USER_COORDINATES = document.querySelector('#user_coordiates');

const getUserPosition = () => {
    if (!latestPoses.length) return null;

    const nose = tracker.findKeypoint('nose', latestPoses[0]);
    if (nose && nose.score > tracker.minScore) {
        return {
            x: Math.round(tracker.scaleX(nose.x)),
            y: Math.round(tracker.scaleY(nose.y))
        };
    }

    return null;
}

const getUserDistance = () => {
    if (!latestPoses.length) return null;

    const pose = latestPoses[0];
    const leftShoulder = tracker.findKeypoint('left_shoulder', pose);
    const rightShoulder = tracker.findKeypoint('right_shoulder', pose);

    if (leftShoulder && rightShoulder &&
        leftShoulder.score > tracker.minScore && rightShoulder.score > tracker.minScore) {

        const dx = tracker.scaleX(leftShoulder.x) - tracker.scaleX(rightShoulder.x);
        const dy = tracker.scaleY(leftShoulder.y) - tracker.scaleY(rightShoulder.y);
        return Math.sqrt(dx * dx + dy * dy).toFixed(1);
    }

    return null;
}

// Export all tracked poses so sketch.js can access them
window.getLatestPoses = () => latestPoses;

const init = () => {
    tracker.setModel('MoveNetMultiPoseLightning');
    tracker.elCanvas = '#canvas';
    tracker.elVideo = '#video';

    tracker.on('afterupdate', function (poses) {
        latestPoses = poses || [];
    });

    setInterval(() => {
        const pos = getUserPosition();
        const dist = getUserDistance();

        $USER_COORDINATES.textContent = pos ? `User Pos: (${pos.x}, ${pos.y})` : 'User Pos: -';
        $USER_DISTANCE.textContent = dist ? `Distance: ${dist}` : 'Distance: -';
    }, 100);

    tracker.run('camera');
}

init();