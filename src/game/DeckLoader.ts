import { readFileSync } from "fs"
export default class DeckLoader {
  private decks: Deck[] = []
  private infos: DeckInfo[] = []

  public constructor(path: string) {
    this.loadDecks(path)
  }
  public getDecks(): Deck[] {
    return this.decks
  }

  public getDeckInfos(): DeckInfo[] {
    return this.infos
  }
  public getDeck(name: string): Deck | undefined {
    return this.decks.find((deck) => deck.name === name)
  }

  public loadDecks(path: string) {
    this.decks = JSON.parse(readFileSync(path, "utf8")) satisfies Deck[]
    this.infos = this.decks.map((deck) => ({
      name: deck.name,
      white: deck.white.length,
      black: deck.black.length,
    }))
  }
}
