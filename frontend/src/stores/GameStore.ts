import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from '@/types/GameSocketIOTypes'
//import socketEvents from "@/scripts/socketEvents";

export type GameState = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  isConnected: boolean;
  room: string;
  username: string;
  isMaster: boolean;
  isGameRunning: boolean,
  finished: boolean,
  role: PlayerRole,
  phase: GamePhase;
  playerList: PlayerInfo[];
  unfinishedPlayers: string[];
  blackCard: BlackCard;
  handCards: HandCard[];
  votingAnswers: Selectable<Answer>[];
  winner: {
    show: boolean,
    name: string,
    cards: Answer[],
    black: BlackCard,
    winner: string
  },
}

export const useGameStore = defineStore({
  id: "GameStore",
  state: () => ({
    socket: io('localhost:3000'),
    isConnected: false,
    room: "",
    username: "",
    isMaster: false,
    isGameRunning: false,
    finished: false,
    role: "voting",
    phase: "TBS",
    playerList: [],
    unfinishedPlayers: [],
    blackCard: {
      text: "",
      pick: 0
    },
    handCards: [],
    votingAnswers: [],
    winner: {
      show: false,
      name: '',
      cards: [],
      black: {
        text: '',
        pick: 0
      },
      winner: ''
    }
  } as GameState),
  getters: {

  },
  actions: {
    async initSocket() {
      const socketEvents = await import("@/scripts/socketEvents")
      socketEvents.default()
    },
  }
});
