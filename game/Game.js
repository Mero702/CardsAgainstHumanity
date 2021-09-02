const shuffleArray = require('../scripts/shuffleArray')
const Player = require('./Player')
module.exports = class Game {
    constructor(id, deck) {
        this.uuid = id,
        this.pile = deck,
        this.phase = 'TBS',
        this.turn = 1,
        this.currentBlackCard = null
        this.usedCards = {
            black: [],
            white:[]
        },
        this.answers = [],
        this.unfinishedPlayers = [],
        this.players = []
    }
    addPlayer(socketID, username, isMaster) {
        this.players.push(new Player(socketID, username, isMaster))
    }
    hasPlayerName(username) {
        return this.players.some(x => x.name == username)
    }
    shuffleCards() {
        this.pile.black = shuffleArray(this.pile.black)
        this.pile.white = shuffleArray(this.pile.white)
    }
    drawBlackCard() {
        if(this.currentBlackCard != null)
            this.usedCards.black.push(this.currentBlackCard)
        this.currentBlackCard = this.pile.black.shift()
    }
    giveCards(player) {
        player.cards = [...player.cards, ...this.pile.white.splice(0, 5 - player.cards.length)]
    }
    findPlayer(id) {
        return this.players.find(p => p.socketID == id)
    }
    kickPlayer(id) {
        const order = this.players.find(p => p.socketID == id).order
        this.players.forEach(element => {
            if(element.order > order)
                element.order -= 1
        })
        this.players = this.players.filter(p => p.socketID != id)
    }
}