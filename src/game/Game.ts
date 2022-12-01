import { getRandomOrder, shuffleArray } from "./utils"
import Player from "./Player"
import {
  Deck,
  GamePhase,
  BlackCard,
  Answer,
  WhiteCard,
  PlayerRole,
  OrderedWhiteCard,
  PlayerInfo,
} from "../../types/GameTypes"

class PlayerAnswerMap extends Array<[string, string]> {
  addPlayer(player: string): string {
    let randomID: string
    do {
      randomID = Math.random().toString(36).substring(2, 7)
    } while (this.some((x) => x[0] == randomID))
    this.push([randomID, player])
    return randomID
  }
  getPlayer(answer: string): string {
    return this.find((x) => x[0] == answer)?.[1] || "error"
  }
  playerExist(player: string): boolean {
    return this.some((x) => x[1] == player)
  }
}
export default class Game {
  uuid: string
  pile: Deck
  phase: GamePhase
  round: number
  currentBlackCard: BlackCard | undefined
  usedCards: Deck
  answers: Answer[]
  unfinishedPlayers: string[]
  players: Player[]
  playerAnswerMap: PlayerAnswerMap

  constructor(id: string, deck: Deck) {
    this.uuid = id
    this.pile = deck
    this.phase = "TBS"
    this.round = 1
    this.currentBlackCard = undefined
    this.usedCards = {
      name: "used",
      black: [],
      white: [],
    }
    this.answers = []
    this.unfinishedPlayers = []
    this.players = []
    this.playerAnswerMap = new PlayerAnswerMap()
  }
  addPlayer(
    socketID: string,
    username: string
  ): { error?: string; isHost?: boolean } {
    if (this.phase != "TBS") return { error: `The game has already started` }

    if (this.hasPlayerName(username))
      return { error: "Username is already taken" }

    let isHost = this.players.length > 0 ? false : true
    this.players.push(new Player(socketID, username, isHost))
    return { isHost: isHost }
  }

  startGame(
    updateCards: (
      socketID: string,
      cards: WhiteCard[],
      card: BlackCard,
      role: PlayerRole
    ) => void
  ): string | undefined {
    if (this.phase != "TBS") return "game already started"
    if (this.players.length < 3) return "you need at least 3 Players"
    if (
      this.pile.white.length < this.players.length * 5 ||
      this.pile.black.length < 3
    )
      return "not enough cards in the deck"

    this.shuffleCards()
    let randomID = getRandomOrder(this.players.length)
    this.players.forEach((player) => (player.order = randomID.next().value))

    this.nextPhase(updateCards)
  }
  nextPhase(
    updateCards: (
      socketID: string,
      cards: WhiteCard[],
      card: BlackCard,
      role: PlayerRole
    ) => void
  ): string | void {
    this.phase = this.phase == "ANSWERING" ? "VOTING" : "ANSWERING"
    if (this.phase == "ANSWERING") this.drawBlackCard()
    this.players.forEach((player) => {
      this.giveCards(player)
      player.role =
        this.round % this.players.length == player.order
          ? "VOTING"
          : "ANSWERING"
      player.finished = this.phase != player.role
      if (this.phase == "ANSWERING") {
        if (this.currentBlackCard)
          updateCards(
            player.socketID,
            player.cards,
            this.currentBlackCard,
            player.role
          )
        else return "an unknown error occurred while drawing a black card"
      }
    })
  }
  submitAnswer(
    id: string,
    submittedAnswer: OrderedWhiteCard[],
    startVoting: (id: string, cards: Array<Answer>) => void
  ) {
    let player = this.findPlayer(id)
    if (!player) return "Player is not in a game room"
    if (this.phase != "ANSWERING") return "Game is not in the answering phase"
    if (this.playerAnswerMap.playerExist(id))
      return "User has already submitted an answer"

    let randomID = this.playerAnswerMap.addPlayer(id)
    let answer: Answer = { id: randomID, cards: [] }

    submittedAnswer.forEach((card) => {
      if (player) {
        let index = player.cards.findIndex((c) => c.text == card.text)
        player.cards.splice(index, 1)
        answer.cards.push(card)
      }
    })

    answer.cards.sort((a, b) => a.order - b.order)
    this.answers.push(answer)

    player.finished = true

    if (this.answers.length == this.players.length - 1) {
      this.nextPhase()
      startVoting(votingPlayer.socketID, this.answers)
    }
  }
  submitVoting(
    id: string,
    answerID: string,
    announceWinner: (
      winnerName: string,
      blackCard: BlackCard,
      answers: Answer[],
      answerID: string
    ) => void
  ) {
    let player = this.findPlayer(id)
    if (!player) return "Player is not in this game"
    if (this.phase != "VOTING") return "Game is not in the voting phase"
    if (player.role != "VOTING") return "You are not the right player"
    let roundWinnerID = this.playerAnswerMap.find((x) => x[0] == answerID)?.[1]
    if (!roundWinnerID) return "an unknown error occurred while voting"
    let roundWinner = this.findPlayer(roundWinnerID)
    if (!roundWinner) return "an unknown error occurred while voting"
    roundWinner.score += 1
    if (this.currentBlackCard)
      announceWinner(
        roundWinner.name,
        this.currentBlackCard,
        this.answers,
        answerID
      )
    this.unfinishedPlayers = []
    // Removes used cards
    this.answers.forEach((answer) => {
      this.usedCards.white.push(
        ...answer.cards.map((card) => ({ text: card.text }))
      )
    })
    this.drawBlackCard()
    this.playerAnswerMap = new PlayerAnswerMap()
    this.answers = []
    this.round += 1
    this.phase = "ANSWERING"
    this.nextPlayer()

    this.players.forEach((p) => {
      this.giveCards(p)
      if (p.role == "VOTING") this.unfinishedPlayers.push(p.name)
    })
  }
  nextPlayer() {
    let player = this.players.find((p) => p.role == "VOTING")
    if (!player) return
    player.role = "ANSWERING"
    this.players.find((p) => (p.order = player?.order || 0 + 1))
  }
  leaveRoom(id: string) {
    let player = this.findPlayer(id)
    if (!player) return
    this.answers = this.answers.filter((el) => el.id != player?.socketID)

    this.kickPlayer(player.socketID)
    if (this.answers.length == this.players.length - 1) {
      this.phase = "VOTING"
      let votingPlayer = this.players.find((p) => p.role == "ANSWERING")
      if (!votingPlayer) return
      this.unfinishedPlayers = [votingPlayer.name]
    }
  }
  hasPlayerName(username: string) {
    return this.players.some((x) => x.name == username)
  }
  shuffleCards() {
    this.pile.black = shuffleArray(this.pile.black)
    this.pile.white = shuffleArray(this.pile.white)
  }
  drawBlackCard() {
    if (this.currentBlackCard != null)
      this.usedCards.black.push(this.currentBlackCard)
    this.currentBlackCard = this.pile.black.shift()
  }
  giveCards(player: Player) {
    player.cards = [
      ...player.cards,
      ...this.pile.white.splice(0, 5 - player.cards.length),
    ]
  }
  findPlayer(id: string) {
    return this.players.find((p) => p.socketID == id)
  }
  getUnfinishedPlayers(): string[] {
    return this.unfinishedPlayers.map(
      (p) => this.findPlayer(p)?.name || "error"
    )
  }
  getPlayerInfos(): PlayerInfo[] {
    return this.players.map((x) => x.getInfo())
  }
  kickPlayer(id: string) {
    const order: number | undefined = this.players.find(
      (p) => p.socketID == id
    )?.order
    if (order == undefined) return
    this.players.forEach((element) => {
      if (element.order > order) element.order -= 1
    })
    this.players = this.players.filter((p) => p.socketID != id)
  }
}
