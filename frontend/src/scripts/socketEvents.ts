import { useGameStore } from "@/stores/GameStore"
const GameStore = useGameStore()
export default function() {
    GameStore.$state.socket.on('updateUsers', (player) => {
        GameStore.$state.playerList = player
        GameStore.$state.playerList.sort((a,b) => a.order - b.order)
      })

      GameStore.$state.socket.on('updateCards', (cards: WhiteCard[], blackCard: BlackCard, role: PlayerRole) => {
        GameStore.$state.handCards = cards.map( x => {return {selected: false, order: 0, ...x}})
        GameStore.$state.isGameRunning = true
        GameStore.$state.blackCard = blackCard
        GameStore.$state.role = role
    })
    GameStore.$state.socket.on('updatePhase', (phase) => {
        GameStore.$state.phase = phase
    })
    GameStore.$state.socket.on('updateWaiting', (unfinishedPlayers) => {
        GameStore.$state.unfinishedPlayers = unfinishedPlayers
    })
    GameStore.$state.socket.on('voting', (answer) => {
        GameStore.$state.votingAnswers = answer
    })
    GameStore.$state.socket.on("WinnerAnnouncement", (username: string, blackCard, cards: Answer[], winner) => {
        GameStore.$state.winner = {
            show: true,
            name: username,
            cards: cards,
            black: blackCard,
            winner: winner
        }
    })
}