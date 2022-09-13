import { useGameStore } from "@/stores/GameStore"
const GameStore = useGameStore()
export default function () {
    GameStore.$state.socket.on('updateUsers', (player) => {
        GameStore.$state.game.playerList = player
        GameStore.$state.game.playerList.sort((a, b) => a.order - b.order)
    })

    GameStore.$state.socket.on('updateCards', (cards: WhiteCard[], blackCard: BlackCard, role: PlayerRole) => {
        GameStore.$state.cards.whiteCards = cards.map(x => { return { selected: false, order: 0, ...x } })
        GameStore.$state.cards.blackCard = blackCard
        GameStore.$state.user.role = role
    })
    GameStore.$state.socket.on('updatePhase', (phase) => {
        GameStore.$state.game.phase = phase
    })
    GameStore.$state.socket.on('updateWaiting', (unfinishedPlayers) => {
        GameStore.$state.game.playerList.forEach(player => player.finished = (player.name in unfinishedPlayers) ? false : true)
    })
    GameStore.$state.socket.on('voting', (answer) => {
        GameStore.$state.cards.votingAnswers = answer.map(x => ({ selected: false, ...x }))
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