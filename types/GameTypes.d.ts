export declare interface Deck {
    name: string;
    white: WhiteCard[],
    black: BlackCard[],
}
export declare interface DeckInfo {
    name: string;
    white: number;
    black: number;
}
export declare type Card = BlackCard | WhiteCard;
export declare interface BlackCard {
    text: string;
    pick: number;
}
export declare interface WhiteCard {
    text: string;
}
export declare interface HandCard extends WhiteCard {
    selected: boolean;
    order: number;
}
export declare interface OwnedWhiteCard extends WhiteCard {
    id: string;
}
export declare interface OrderedWhiteCard extends WhiteCard {
    order: number;
}
export declare interface Answer {
    id: string;
    cards: Array<OrderedWhiteCard>;
}
export declare interface PlayerInfo {
    name: string;
    score: number;
    order: number;
    socketID: string;
    isHost: boolean;
    finished: boolean;
    role: PlayerRole;
}
export declare type PlayerRole = 'ANSWERING' | 'VOTING';
export declare type GamePhase = 'TBS' | 'ANSWERING' | 'VOTING';
export declare type Test = 'test';
