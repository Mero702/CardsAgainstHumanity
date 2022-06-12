export default class Player {
    socketID: string
    name: string
    isMaster: boolean
    order: number
    score: number
    cards: WhiteCard[]
    
    constructor(socketID: string, username: string, isMaster: boolean) {
        this.socketID = socketID
        this.name = username
        this.isMaster = isMaster
        this.order = 0
        this.score = 0
        this.cards = []
    }
    getRole(turn: number, playerCount: number): PlayerRole {
       return ((turn-1)%playerCount+1 == this.order) ? 'voting' : 'judging'
    }
    getInfo(): PlayerInfo {
        return {
            socketID: this.socketID,
            name: this.name,
            isMaster: this.isMaster,
            order: this.order,
            score: this.score
        }
    }
}