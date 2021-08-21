import Game from './Game'
export default class {
    constructor() {
        this.games = []
    }
    createGame(id) {
        this.games.push(new Game(id))
    }
}