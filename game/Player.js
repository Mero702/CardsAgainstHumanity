module.exports = class Player {
    constructor(socketID, username, isMaster) {
        this.socketID = socketID
        this.name = username
        this.isMaster = isMaster
        this.order = 0
        this.score = 0
        this.cards = []
    }
    getRole(turn, playerCount) {
       return ((turn-1)%playerCount+1 == this.order) ? 'voting' : 'awnsering'
    }
    getInfo() {
        return {
            name: this.name,
            isMaster: this.isMaster,
            order: this.order,
            score: this.score
        }
    }
}