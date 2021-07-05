const socket = io();

function init() {
    draw();
    socket.emit('init', {playerName: player.name});
}

socket.on('connect_error', () => {
    console.log('Socket.io connection error in client');
});

socket.on('initReturn', data => {
    orbs = data.orbs;
    player.uid = data.playerId;
    setInterval(() => {
        if(player.xVector) {
            socket.emit('tick', {
                xVector: player.xVector,
                yVector: player.yVector
            });
        }
    }, 33);
});

socket.on('tock', data => {
    players = data.players;
});

socket.on('orbSwitch', data => {
    orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on('tickTock', data => {
    player.locX = data.playerX;
    player.locY = data.playerY;
});

socket.on('updateLeaderBoard', data => {
    const leaderboard = document.querySelector('.leader-board');
    leaderboard.innerHTML = '';
    data.forEach(({name, score}) => {
        leaderboard.innerHTML += `<li class='leaderboard-player'>${name} - ${score}</li>`;
    });
});

socket.on('updateScore', data =>  document.querySelector('.player-score').innerText = data);

socket.on('playerDeath', data => {
    document.querySelector('#game-message').innerHTML = `${data.killedBy.name} absorbed ${data.died.name}`;
    $('#game-message').css({
        "background-color": "00e6e6",
        "opacity": 1
    });
    $('#game-message').show();
    $('#game-message').fadeOut(5000);
});
