import Game from "./Game"
export default class GameManager {
    games: Game[];
    constructor() {
        this.games = []
    }
    createGame (deck: Deck): string|false {
        let i = 0;
        let roomID: string;
        do {
            roomID = Math.random().toString(36).substring(2, 7)
            i++
        } while(this.ifGameExist(roomID)&&i<10)
        
        if(this.ifGameExist(roomID))
            return false
        
            this.games.push(new Game(roomID, deck))
        return roomID
    }
    ifGameExist (roomID: string) {
        return this.games.find(x => x.uuid == roomID)
    }
    findGame (roomID: string|undefined): Game|false {
        if(!roomID || !this.ifGameExist(roomID))
            return false
        return this.games.find(x => x.uuid == roomID) || false
    }
}