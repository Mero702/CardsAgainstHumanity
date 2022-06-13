import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import "../../../types/GameTypes";
import type { ClientToServerEvents, ServerToClientEvents } from '../../../types/GameSocketIOTypes'

export type GameState = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  isConnected: boolean;
  room: string;
  username: string;
  isMaster: boolean;
  isGameRunning: boolean,
  finished: boolean,
  phase: GamePhase;
  playerList: PlayerInfo[];
  unfinishedPlayers: string[];
  blackCard: BlackCard;
  handCards: WhiteCard[];
  votedAnswers: Answer[];
  winner: {
    show: boolean,
    name: string,
    white: WhiteCard,
    black: BlackCard
  },
}

export const useGameStore = defineStore({
  id: "GameStore",
  state: () => ({
    socket: io(),
    isConnected: false,
    room: "",
    username: "",
    isMaster: false,
    isGameRunning: false,
    finished: false,
    phase: "TBS",
    playerList: [],
    unfinishedPlayers: [],
    blackCard: {
      text: "",
      pick: 0
    },
    handCards: [],
    votedAnswers: [],
    winner: {
      show: false,
      name: '',
      white: {
        text: ''
      },
      black: {
        text: '',
        pick: 0
      }
    }
  } as GameState),
  getters: {

  },
  actions: {
  },
});
