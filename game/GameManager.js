const Game = require('./Game')
module.exports = class {
    constructor() {
        this.games = []
    }
    createGame (id, deck) {
        this.games.push(new Game(id, deck))
    }
    ifGameExist (roomID) {
        return this.games.find(x => x.uuid == roomID)
    }
    findGame (roomID) {
        if(this.ifGameExist(roomID))
            return this.games.find(x => x.uuid == roomID)
        return false
    }
}