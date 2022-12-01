export interface ClientToServerEvents {
  joinRoom: (
    room: string,
    username: string,
    callback: (param: { ok: boolean; isHost: boolean; error?: string }) => void
  ) => void
  startGame: (
    callback: (param: { ok: boolean; error?: string }) => void
  ) => void
  submitAnswer: (
    cards: OrderedWhiteCard[],
    callback: (param: { ok: boolean; error?: string }) => void
  ) => void
  submitVoting: (
    answerID: string,
    callback: (param: { ok: boolean; error?: string }) => void
  ) => void
  leaveRoom: () => void
}

export interface ServerToClientEvents {
  updateUsers: (players: PlayerInfo[]) => void
  updateCards: (cards: Card[], blackCard: BlackCard, role: PlayerRole) => void
  updatePhase: (phase: GamePhase) => void
  voting: (cards: Array<Answer>) => void
  WinnerAnnouncement: (
    winner: string,
    blackCard: BlackCard,
    cards: Answer[],
    answerID: string
  ) => void
}

export interface InterServerEvents {}

export interface GameSocketData {
  room: string
  username: string
  isHost: boolean
}
