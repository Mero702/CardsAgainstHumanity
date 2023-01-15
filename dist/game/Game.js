import { getRandomOrder, shuffleArray } from "./utils.js";
import Player from "./Player.js";
class PlayerAnswerMap extends Array {
    addPlayer(player) {
        let randomID;
        do {
            randomID = Math.random().toString(36).substring(2, 7);
        } while (this.some((x) => x[0] == randomID));
        this.push([randomID, player]);
        return randomID;
    }
    getPlayer(answer) {
        return this.find((x) => x[0] == answer)?.[1] || "error";
    }
    playerExist(player) {
        return this.some((x) => x[1] == player);
    }
}
export default class Game {
    uuid;
    pile;
    phase;
    round;
    currentBlackCard;
    usedCards;
    answers;
    unfinishedPlayers;
    players;
    playerAnswerMap;
    constructor(id, deck) {
        this.uuid = id;
        this.pile = deck;
        this.phase = "TBS";
        this.round = -1;
        this.currentBlackCard = undefined;
        this.usedCards = {
            name: "used",
            black: [],
            white: [],
        };
        this.answers = [];
        this.unfinishedPlayers = [];
        this.players = [];
        this.playerAnswerMap = new PlayerAnswerMap();
    }
    addPlayer(socketID, username) {
        if (this.phase != "TBS")
            return { error: `The game has already started` };
        if (this.hasPlayerName(username))
            return { error: "Username is already taken" };
        let isHost = this.players.length > 0 ? false : true;
        this.players.push(new Player(socketID, username, isHost));
        return { isHost: isHost };
    }
    startGame() {
        if (this.phase != "TBS")
            return "game already started";
        if (this.players.length < 3)
            return "you need at least 3 Players";
        if (this.pile.white.length < this.players.length * 5 ||
            this.pile.black.length < 3)
            return "not enough cards in the deck";
        this.shuffleCards();
        let randomID = getRandomOrder(this.players.length);
        this.players.forEach((player) => (player.order = randomID.next().value - 1));
        this.nextPhase();
    }
    nextPhase() {
        this.phase = this.phase == "ANSWERING" ? "VOTING" : "ANSWERING";
        if (this.phase == "ANSWERING") {
            this.drawBlackCard();
            this.round++;
        }
        this.players.forEach((player) => {
            this.giveCards(player);
            player.role =
                player.order == this.round % this.players.length
                    ? "VOTING"
                    : "ANSWERING";
            player.finished = this.phase != player.role;
        });
    }
    submitAnswer(id, submittedAnswer, startVoting) {
        let player = this.findPlayer(id);
        if (!player)
            return "Player is not in a game room";
        if (this.phase != "ANSWERING")
            return "Game is not in the answering phase";
        if (this.playerAnswerMap.playerExist(id))
            return "User has already submitted an answer";
        let randomID = this.playerAnswerMap.addPlayer(id);
        let answer = { id: randomID, cards: [] };
        submittedAnswer.forEach((card) => {
            if (player) {
                let index = player.cards.findIndex((c) => c.text == card.text);
                player.cards.splice(index, 1);
                answer.cards.push(card);
            }
        });
        answer.cards.sort((a, b) => a.order - b.order);
        this.answers.push(answer);
        player.finished = true;
        // if all players, who aren't the voting player, have submitted an answer
        if (this.answers.length == this.players.length - 1) {
            var votingPlayer = this.players.find((p) => p.role == "VOTING");
            if (!votingPlayer)
                throw "No voting player found";
            startVoting(votingPlayer.socketID, this.answers);
            this.nextPhase();
        }
    }
    submitVoting(id, answerID, announceWinner) {
        let player = this.findPlayer(id);
        if (!player)
            return "Player is not in this game";
        if (this.phase != "VOTING")
            return "Game is not in the voting phase";
        if (player.role != "VOTING")
            return "You are not the right player";
        let roundWinnerID = this.playerAnswerMap.find((x) => x[0] == answerID)?.[1];
        if (!roundWinnerID)
            return "an unknown error occurred while voting";
        let roundWinner = this.findPlayer(roundWinnerID);
        if (!roundWinner)
            return "an unknown error occurred while voting";
        roundWinner.score += 1;
        if (this.currentBlackCard)
            announceWinner(roundWinner.name, this.currentBlackCard, this.answers, answerID);
        // Removes used cards
        this.answers.forEach((answer) => {
            this.usedCards.white.push(...answer.cards.map((card) => ({ text: card.text })));
        });
        this.playerAnswerMap = new PlayerAnswerMap();
        this.answers = [];
        this.nextPhase();
    }
    leaveRoom(id) {
        let player = this.findPlayer(id);
        if (!player)
            return;
        this.answers = this.answers.filter((el) => el.id != player?.socketID);
        this.kickPlayer(player.socketID);
        if (this.answers.length == this.players.length - 1) {
            this.phase = "VOTING";
            let votingPlayer = this.players.find((p) => p.role == "ANSWERING");
            if (!votingPlayer)
                return;
            this.unfinishedPlayers = [votingPlayer.name];
        }
    }
    hasPlayerName(username) {
        return this.players.some((x) => x.name == username);
    }
    shuffleCards() {
        this.pile.black = shuffleArray(this.pile.black);
        this.pile.white = shuffleArray(this.pile.white);
    }
    drawBlackCard() {
        if (this.currentBlackCard != null)
            this.usedCards.black.push(this.currentBlackCard);
        this.currentBlackCard = this.pile.black.shift();
    }
    giveCards(player) {
        player.cards = [
            ...player.cards,
            ...this.pile.white.splice(0, 5 - player.cards.length),
        ];
    }
    findPlayer(id) {
        return this.players.find((p) => p.socketID == id);
    }
    getUnfinishedPlayers() {
        return this.unfinishedPlayers.map((p) => this.findPlayer(p)?.name || "error");
    }
    getPlayerInfos() {
        return this.players.map((x) => x.getInfo());
    }
    kickPlayer(id) {
        const order = this.players.find((p) => p.socketID == id)?.order;
        if (order == undefined)
            return;
        this.players.forEach((element) => {
            if (element.order > order)
                element.order -= 1;
        });
        this.players = this.players.filter((p) => p.socketID != id);
    }
}
