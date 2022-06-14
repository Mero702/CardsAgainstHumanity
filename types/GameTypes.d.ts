declare interface Deck {
    name: string;
    white: WhiteCard[],
    black: BlackCard[],
}
declare interface DeckInfo {
    name: string;
    white: number;
    black: number;
}
declare type Card = BlackCard | WhiteCard;
declare interface BlackCard {
    text: string;
    pick: number;
}
declare interface WhiteCard {
    text: string;
}
declare interface HandCard extends WhiteCard {
    selected: boolean;
    order: number;
}
declare interface OwnedWhiteCard extends WhiteCard {
    id: string;
}
declare interface OrderedWhiteCard extends WhiteCard {
    order: number;
}
declare interface Answer {
    id: string;
    cards: Array<OrderedWhiteCard>;
}
declare interface PlayerInfo {
    name: string;
    score: number;
    order: number;
    socketID: string;
    isMaster: boolean;
}
declare type PlayerRole = 'voting' | 'judging';
declare type GamePhase = 'TBS' | 'ANSWERING' | 'VOTING';
declare type Test = 'test';
