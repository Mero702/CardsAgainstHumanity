import { readFileSync } from "fs";

export default class DeckManager {
    private decks: Deck[] | undefined = undefined;
    private infos: DeckInfo[] | undefined;

    public constructor(path: string) {
        this.loadDecks(path);
    }
    public getDecks(): Deck[] {
        return this.decks!;
    }

    public getDeckInfos(): DeckInfo[] {
        return this.infos!;
    }
    public getDeck(name: string): Deck | undefined {
        return this.decks!.find(deck => deck.name === name);
    }

    public async loadDecks(path: string): Promise<void> {
        this.decks = JSON.parse(readFileSync(path, "utf8")) as unknown as Deck[];
        this.infos = this.decks!.map(deck => ({name: deck.name, white: deck.white.length, black: deck.black.length}));
    }
}
