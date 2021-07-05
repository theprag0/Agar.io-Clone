const io = require('../servers').io;
const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

let orbs = [];
let players = [];
const settings = {
    defaultOrbs: 5000,
    defaultSpeed: 6,
    defaultSize: 6,
    // As the player size gets bigger, zoom out
    zoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000
};

initGame();

setInterval(() => {
    if (players.length > 0){
        io.to('game').emit('tock', {
            players
        });
    }
}, 33);

io.sockets.on('connect', (socket) => {
    console.log('socket connected')
    let player = {};
    player.tickSent = false;
    // A player has connected
    socket.on('init', data => {
        socket.join('game');
        // Make a playerConfig object
        let playerConfig = new PlayerConfig(settings);
        // Make a playerData object
        let playerData = new PlayerData(data.playerName, settings);
        // Make a master Player object with all data
        player = new Player(socket.id, playerData, playerConfig);
        
        socket.emit('initReturn', {orbs}); 

        players.push(playerData);

        setInterval(() => {
            if (player.tickSent){
                socket.emit('tickTock', {
                    playerX: player.playerData.locX,
                    playerY: player.playerData.locY,
                });
            }
        }, 33);
    });

    socket.on('tick', data => {
        if (data.xVector && data.yVector) {
            player.tickSent = true;
            speed = player.playerConfig.speed;
            xV = player.playerConfig.xVector = data.xVector;
            yV = player.playerConfig.yVector = data.yVector;
    
            if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
                player.playerData.locY -= speed * yV;
            }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
                player.playerData.locX += speed * xV;
            }else{
                player.playerData.locX += speed * xV;
                player.playerData.locY -= speed * yV;
            } 

            // Orb Collisions
            let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
            capturedOrb.then(data => {
                const orbData = {
                    orbIndex: data,
                    newOrb: orbs[data]
                };
                io.sockets.emit('orbSwitch', orbData)
                // Update Leaderboard
                io.sockets.emit('updateLeaderBoard', getLeaderBoard());
                socket.emit('updateScore', player.playerData.score);
            }).catch(() => {
    
            });

            // Player Collisions
            let capturedPlayer = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId);
            capturedPlayer.then(data => {
                // Update Leaderboard
                io.sockets.emit('updateLeaderBoard', getLeaderBoard());
                io.sockets.emit('playerDeath', data);
                if (data.died.uid === player.playerData.uid){
                    console.log(player.socketId)
                }
                socket.emit('updateScore', player.playerData.score);
            }).catch(() => {

            });
        }
    });

    socket.on('disconnect', data => {
        if(player.playerData) {
            players.forEach((currPlayer, i) => {
                if(currPlayer.uid === player.playerData.uid) {
                    players.splice(i, 1);
                    io.sockets.emit('updateLeaderBoard', getLeaderBoard());
                }
            });
        }
    });
});

// Generate Leaderboard based on player playerData.score
function getLeaderBoard() {
    players.sort((a, b) => {
        return b.score - a.score;
    });

    const leaderboard = players.map(({name, score}) => {
        return {
            name, 
            score
        };
    });
    return leaderboard;
}

// Run when the game starts initially
function initGame(){
    for (let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}

module.exports = io;