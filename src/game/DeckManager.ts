import DeckLoader from "./DeckLoader.js"

export default class DeckManager {
  private deck: Deck

  constructor() {
    this.deck = {
      name: "deck",
      white: [],
      black: [],
    }
  }
  public addDecks(names: string[], manager: DeckLoader) {
    names.forEach((element) => {
      let deck = manager.getDeck(element)
      if (deck?.black != undefined) this.deck.black.push(...deck.black)
      if (deck?.white != undefined) this.deck.white.push(...deck.white)
    })
  }
  public addCustomDecks(decks: Deck[]) {
    decks.forEach((deck) => {
      this.deck.black.push(...deck.black)
      this.deck.white.push(...deck.white)
    })
  }
  public countCards() {
    return {
      white: this.deck.white.length,
      black: this.deck.black.length,
    }
  }
  public getDeck(): Deck {
    return this.deck
  }
}
