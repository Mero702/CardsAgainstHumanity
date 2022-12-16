import { defineStore } from "pinia"
import { io, Socket } from "socket.io-client"
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/GameSocketIOTypes"
//import socketEvents from "@/scripts/socketEvents";

export type GameState = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  isConnected: boolean
  error: string
  game: {
    room: string
    phase: GamePhase
    playerList: PlayerInfo[]
  }
  user: {
    username: string
    isHost: boolean
    finished: boolean
    role: PlayerRole
  }
  cards: {
    blackCard: BlackCard
    whiteCards: HandCard[]
    votingAnswers: Selectable<Answer>[]
  }
  winner: {
    show: boolean
    name: string
    cards: Answer[]
    black: BlackCard
    winner: string
  }
}

export const useGameStore = defineStore({
  id: "GameStore",
  state: () =>
    ({
      socket: io(import.meta.env.DEV ? "localhost:3000" : ""),
      isConnected: false,
      error: "",
      game: {
        room: "",
        phase: "TBS",
        playerList: [],
      },
      user: {
        username: "",
        isHost: false,
        finished: false,
        role: "VOTING",
      },
      cards: {
        blackCard: {
          text: "",
          pick: 0,
        },
        whiteCards: [],
        votingAnswers: [],
      },
      winner: {
        show: false,
        name: "",
        cards: [],
        black: {
          text: "",
          pick: 0,
        },
        winner: "",
      },
    } as GameState),
  getters: {},
  actions: {
    isWaiting() {
      return (
        this.$state.game.phase == "TBS" ||
        (this.$state.game.phase == "VOTING" &&
          this.$state.user.role == "ANSWERING") ||
        (this.$state.game.phase == "ANSWERING" &&
          (this.$state.user.role == "VOTING" || this.$state.user.finished))
      )
    },
    async initSocket() {
      const socketEvents = await import("@/scripts/socketEvents")
      socketEvents.default()
    },
    joinRoom(username: string, roomID: string) {
      this.$state.socket.emit("joinRoom", roomID, username, (result) => {
        if (result.ok) {
          this.$state.user.username = username
          this.$state.game.room = roomID
          this.$state.isConnected = true
          this.$state.user.isHost = result.isHost
        } else {
          if (result.error) this.$state.error = result.error
        }
      })
    },
    startGame() {
      this.$state.socket.emit("startGame", (param) => {
        if (!param.ok) this.$state.error = param.error || "Something went wrong"
      })
    },
    selectCard(key: string) {
      let index = parseInt(key)

      if (this.$state.cards.whiteCards[index].selected) {
        this.$state.cards.whiteCards[index].selected = false
        this.$state.cards.whiteCards
          .filter(
            (x) =>
              x.selected && this.$state.cards.whiteCards[index].order > x.order
          )
          .forEach((x) => x.order--)
        this.$state.cards.whiteCards[index].order = 0
      } else {
        if (
          this.$state.cards.blackCard.pick != 1 &&
          this.$state.cards.blackCard.pick <=
            this.$state.cards.whiteCards.filter((x) => x.selected).length
        )
          return
        if (this.$state.cards.blackCard.pick == 1)
          this.$state.cards.whiteCards
            .filter((x) => x.selected)
            .forEach((x) => (x.selected = false))
        this.$state.cards.whiteCards[index].selected = true
        this.$state.cards.whiteCards[index].order =
          this.$state.cards.whiteCards.filter((x) => x.selected).length
      }
    },
    submitAnswer() {
      let selectedCards = this.$state.cards.whiteCards
        .filter((card) => card.selected)
        .map((x) => {
          const { selected, ...rest } = x
          return rest
        })
      if (selectedCards.length != this.$state.cards.blackCard.pick)
        return alert(
          "You must select " + this.$state.cards.blackCard.pick + " cards"
        )
      selectedCards.sort((a, b) => a.order - b.order)
      this.$state.socket.emit("submitAnswer", selectedCards, (param) => {
        if (!param.ok) alert(param.error)
      })
    },
    selectAnswer(key: string) {
      this.$state.cards.votingAnswers.forEach((x) => (x.selected = false))
      let item = this.$state.cards.votingAnswers.find((x) => x.id == key)
      if (item != undefined) item.selected = true
    },
    submitVoting() {
      let selectedCards = this.$state.cards.votingAnswers
        .filter((card) => card.selected)
        .map((x) => {
          const { selected, ...rest } = x
          return rest
        })
      console.log("try to submit voting")

      this.$state.socket.emit("submitVoting", selectedCards[0].id, (param) => {
        console.log("submitted voting")

        if (!param.ok) alert(param.error)
      })
    },
  },
})
