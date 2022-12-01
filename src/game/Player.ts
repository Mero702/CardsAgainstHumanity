import { WhiteCard, PlayerRole, PlayerInfo } from "../../types/GameTypes"

export default class Player {
  socketID: string
  name: string
  isHost: boolean
  order: number
  score: number
  cards: WhiteCard[]
  finished: boolean
  role: PlayerRole

  constructor(socketID: string, username: string, isHost: boolean) {
    this.socketID = socketID
    this.name = username
    this.isHost = isHost
    this.order = 0
    this.score = 0
    this.cards = []
    this.finished = !isHost
    this.role = "ANSWERING"
  }
  getInfo(): PlayerInfo {
    return {
      socketID: this.socketID,
      name: this.name,
      isHost: this.isHost,
      order: this.order,
      score: this.score,
      finished: this.finished,
      role: this.role,
    }
  }
}
