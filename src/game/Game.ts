import { shuffleArray } from './utils';
import Player from './Player'
export default class Game {
        uuid: string;
        pile: Deck;
        phase: GamePhase;
        turn: number;
        currentBlackCard: BlackCard|undefined;
        usedCards: Deck;
        answers: Answer[];
        unfinishedPlayers: string[]
        players: Player[];

    constructor(id: string, deck: Deck) {
        this.uuid = id
        this.pile = deck
        this.phase = 'TBS'
        this.turn = 1
        this.currentBlackCard = undefined
        this.usedCards = {
            name: 'used',
            black: [],
            white:[]
        },
        this.answers = []
        this.unfinishedPlayers = []
        this.players = []
    }
    addPlayer(socketID: string, username: string,isMaster: boolean) {
        this.players.push(new Player(socketID, username, isMaster))
    }
    hasPlayerName(username: string) {
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
    giveCards(player: Player) {
        player.cards = [...player.cards, ...this.pile.white.splice(0, 5 - player.cards.length)]
    }
    findPlayer(id: string) {
        return this.players.find(p => p.socketID == id)
    }
    kickPlayer(id: string) {
        const order: number | undefined = this.players.find(p => p.socketID == id)?.order
        if(order == undefined) return;
        this.players.forEach(element => {
            if(element.order > order)
                element.order -= 1
        })
        this.players = this.players.filter(p => p.socketID != id)
    }
}