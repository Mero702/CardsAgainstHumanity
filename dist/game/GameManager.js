import Game from "./Game";
export default class GameManager {
    games;
    constructor() {
        this.games = [];
    }
    createGame(deck) {
        let i = 0;
        let roomID;
        do {
            roomID = Math.random().toString(36).substring(2, 7);
            i++;
        } while (this.ifGameExist(roomID) && i < 10);
        if (this.ifGameExist(roomID))
            return false;
        this.games.push(new Game(roomID, deck));
        return roomID;
    }
    ifGameExist(roomID) {
        return this.games.find(x => x.uuid == roomID);
    }
    findGame(roomID) {
        if (!roomID || !this.ifGameExist(roomID))
            return false;
        return this.games.find(x => x.uuid == roomID) || false;
    }
}
