import { readFileSync } from "fs";
export default class DeckManager {
    decks = undefined;
    infos;
    constructor(path) {
        this.loadDecks(path);
    }
    getDecks() {
        return this.decks;
    }
    getDeckInfos() {
        return this.infos;
    }
    getDeck(name) {
        return this.decks.find(deck => deck.name === name);
    }
    async loadDecks(path) {
        this.decks = JSON.parse(readFileSync(path, "utf8"));
        this.infos = this.decks.map(deck => ({ name: deck.name, white: deck.white.length, black: deck.black.length }));
    }
}
