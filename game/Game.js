export default class {
    constructor(id, deck) {
        this.uuid = id,
        this.pile = deck,
        this.phase = 'TBS',
        this.turn = 1,
        this.usedCards = {black: [], white:[]},
        this.answers = [],
        this.players = []
    }
}