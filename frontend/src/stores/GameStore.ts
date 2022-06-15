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
    startGame() {
      this.$state.socket.emit("startGame", (param) => {
        if(!param.ok)
          alert(param.error)
      })
    },
    selectCard(key: string) {
      let index = parseInt(key)

      if(this.$state.handCards[index].selected) {
        this.$state.handCards[index].selected = false
        this.$state.handCards.filter(x => x.selected && this.$state.handCards[index].order > x.order).forEach(x => x.order--)
        this.$state.handCards[index].order = 0
      } else {
        if(this.$state.blackCard.pick <= this.$state.handCards.filter(x => x.selected).length)
        return;
        this.$state.handCards[index].selected = true
        this.$state.handCards[index].order = this.$state.handCards.filter(x => x.selected).length
      }
    },
    submitAnswer() {
      let selectedCards = this.$state.handCards.filter(card => card.selected).map(x => {const {selected, ...rest} = x; return rest})
      if(selectedCards.length != this.$state.blackCard.pick)
        return alert("You must select " + this.$state.blackCard.pick + " cards");
      selectedCards.sort((a, b) => a.order - b.order)
      this.$state.socket.emit("submitAnswer", selectedCards, (param) => {
        if(!param.ok)
          alert(param.error)
      });
    },
    selectAnswer(key: string) {
      this.$state.votingAnswers.forEach(x => x.selected = false)
      let item = this.$state.votingAnswers.find(x => x.id == key)
      if(item != undefined) (item.selected = true)
    },
    submitVoting() {
      let selectedCards = this.$state.votingAnswers.filter(card => card.selected).map(x => {const {selected, ...rest} = x; return rest})
      this.$state.socket.emit("submitVoting", selectedCards[0].id, (param) => {
        if(!param.ok)
          alert(param.error)
      })
    }
  }
});
