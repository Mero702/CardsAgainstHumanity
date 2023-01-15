import Game from "./Game.js"
export default class GameManager {
  games: Game[]
  constructor() {
    this.games = []
  }
  createGame(
    deck: Deck
  ): { error: true; message: string } | { error: false; id: string } {
    let i = 0
    let roomID: string

    if (deck.black.length <= 3 || deck.white.length <= 25)
      return { error: true, message: "You should add more decks" }

    do {
      roomID = Math.random().toString(36).substring(2, 7)
      i++

      if (i > 50) return { error: true, message: "Could not create game" }
    } while (this.ifGameExist(roomID))

    this.games.push(new Game(roomID, deck))
    return { error: false, id: roomID }
  }
  ifGameExist(roomID: string) {
    return this.games.find((x) => x.uuid == roomID)
  }
  findGame(roomID: string | undefined): Game | false {
    if (!roomID || !this.ifGameExist(roomID)) return false
    return this.games.find((x) => x.uuid == roomID) || false
  }
  removeGame(uuid: string) {
    if (this.findGame(uuid))
      this.games.splice(
        this.games.findIndex((x) => x.uuid === uuid),
        1
      )
  }
}
