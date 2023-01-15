export default class DeckManager {
    deck;
    constructor() {
        this.deck = {
            name: "deck",
            white: [],
            black: [],
        };
    }
    addDecks(names, manager) {
        names.forEach((element) => {
            let deck = manager.getDeck(element);
            if (deck?.black != undefined)
                this.deck.black.push(...deck.black);
            if (deck?.white != undefined)
                this.deck.white.push(...deck.white);
        });
    }
    addCustomDecks(decks) {
        decks.forEach((deck) => {
            this.deck.black.push(...deck.black);
            this.deck.white.push(...deck.white);
        });
    }
    countCards() {
        return {
            white: this.deck.white.length,
            black: this.deck.black.length,
        };
    }
    getDeck() {
        return this.deck;
    }
}
