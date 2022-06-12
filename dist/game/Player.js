export default class Player {
    socketID;
    name;
    isMaster;
    order;
    score;
    cards;
    constructor(socketID, username, isMaster) {
        this.socketID = socketID;
        this.name = username;
        this.isMaster = isMaster;
        this.order = 0;
        this.score = 0;
        this.cards = [];
    }
    getRole(turn, playerCount) {
        return ((turn - 1) % playerCount + 1 == this.order) ? 'voting' : 'judging';
    }
    getInfo() {
        return {
            socketID: this.socketID,
            name: this.name,
            isMaster: this.isMaster,
            order: this.order,
            score: this.score
        };
    }
}
