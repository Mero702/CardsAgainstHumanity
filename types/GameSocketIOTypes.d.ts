export interface ClientToServerEvents {
    joinRoom: (room: string, username: string, callback: (param: {ok: boolean, isMaster:boolean, error?: string}) => void) => void;
    startGame: (callback: (param: {ok: boolean, error?: string}) => void) => void;
    submitAnswer: (cards: OrderedWhiteCard[], callback: (param: {ok: boolean, error?: string}) => void) => void;
    submitVoting: (cards: Card[], callback: (param: {ok: boolean, error?: string}) => void) => void;
    leaveRoom: () => void;
}

export interface ServerToClientEvents {
    updateUsers: (players: PlayerInfo[]) => void;
    updateCards: (cards: Card[], blackCard: BlackCard, role: PlayerRole) => void;
    updateWaiting: (unfinishedPlayers: string[]) => void;
    updatePhase: (phase: GamePhase) => void;
    voting: (cards: Array<OrderedWhiteCard[]>) => void;
    WinnerAnnouncement: (winner: string, blackCard: BlackCard, cards: Card[]) => void;
}

export interface InterServerEvents {
}

export interface GameSocketData {
    room: string;
    username: string;
    isMaster: boolean;
}