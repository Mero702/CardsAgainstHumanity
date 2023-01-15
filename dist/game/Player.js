export default class Player {
    socketID;
    name;
    isHost;
    order;
    score;
    cards;
    finished;
    role;
    constructor(socketID, username, isHost) {
        this.socketID = socketID;
        this.name = username;
        this.isHost = isHost;
        this.order = 0;
        this.score = 0;
        this.cards = [];
        this.finished = !isHost;
        this.role = "ANSWERING";
    }
    getInfo() {
        return {
            socketID: this.socketID,
            name: this.name,
            isHost: this.isHost,
            order: this.order,
            score: this.score,
            finished: this.finished,
            role: this.role,
        };
    }
}
