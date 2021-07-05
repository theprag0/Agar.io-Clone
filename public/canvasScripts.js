// =================================
// ============DRAWING==============
// =================================
// player.locX = Math.floor((Math.random() * 500) + 10);
// player.locY = Math.floor((Math.random() * 500) + 10);
function draw(){
    // Reset translation every frame
    context.setTransform(1, 0, 0, 1, 0, 0);
    // clear screen so that the old stuff is removed from the last frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Clamp the camera to the player
    let camX = -player.locX + (canvas.width / 2);
    let camY = -player.locY + (canvas.height / 2);
    context.translate(camX, camY);

    // Populate players
    players.forEach(p => {
        context.beginPath();
        context.fillStyle = p.color;
        // Draw circle
        context.arc(p.locX, p.locY, p.radius, 0, Math.PI * 2);
        context.fill();
        // Add border
        context.lineWidth = 3;
        context.strokeStyle = 'rgb(0, 255, 0)';
        context.stroke();
    });

    // Populate orbs
    orbs.forEach(({color, locX, locY, radius}) => {
        context.beginPath();
        context.fillStyle = color;
        context.arc(locX, locY, radius, 0, Math.PI * 2);
        context.fill();
    });

    requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', evt => {
    const mousePosition = {
        x: evt.clientX,
        y: evt.clientY
    };
    let angleDeg = Math.atan2(mousePosition.y - (canvas.height / 2), mousePosition.x - (canvas.width / 2)) * 180 / Math.PI; 
    if (angleDeg >= 0 && angleDeg < 90){
        xVector = 1 - (angleDeg / 90);
        yVector = -(angleDeg / 90);
    } else if (angleDeg >= 90 && angleDeg <= 180){
        xVector = -(angleDeg - 90) / 90;
        yVector = -(1 - ((angleDeg - 90) / 90));
    } else if (angleDeg >= -180 && angleDeg < -90){
        xVector = (angleDeg + 90) / 90;
        yVector = (1 + ((angleDeg + 90) / 90));
    } else if (angleDeg < 0 && angleDeg >= -90){
        xVector = (angleDeg + 90) / 90;
        yVector = (1 - ((angleDeg + 90) / 90));
    }

    player.xVector = xVector;
    player.yVector = yVector;
});