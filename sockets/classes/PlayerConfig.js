// Data of a player that is only accessible by the given player
class PlayerConfig{
    constructor(settings) {
        this.Xvector = 0;
        this.Yvector = 0;
        this.speed = settings.defaultSpeed;
        this.zoom = settings.defaultZoom;
    }
}

module.exports = PlayerConfig;