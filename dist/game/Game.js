import { getRandomOrder, shuffleArray } from './utils';
import Player from './Player';
export default class Game {
    uuid;
    pile;
    phase;
    turn;
    currentBlackCard;
    usedCards;
    answers;
    unfinishedPlayers;
    players;
    playerAnswerMap;
    constructor(id, deck) {
        this.uuid = id;
        this.pile = deck;
        this.phase = 'TBS';
        this.turn = 1;
        this.currentBlackCard = undefined;
        this.usedCards = {
            name: 'used',
            black: [],
            white: []
        },
            this.answers = [];
        this.unfinishedPlayers = [];
        this.players = [];
        this.playerAnswerMap = [];
    }
    addPlayer(socketID, username) {
        if (this.phase != 'TBS')
            return { error: `The game has already started` };
        if (this.hasPlayerName(username))
            return { error: 'Username is already taken' };
        let isHost = this.players.length > 0 ? false : true;
        this.players.push(new Player(socketID, username, isHost));
        return { isMaster: isHost };
    }
    startGame(updateCards) {
        if (this.phase != 'TBS')
            return 'game already started';
        if (this.players.length < 3)
            return 'you need at least 3 Players';
        this.shuffleCards();
        this.drawBlackCard();
        this.phase = 'ANSWERING';
        let randomID = getRandomOrder(this.players.length);
        this.players.forEach(player => {
            player.order = randomID.next().value || 0;
            this.giveCards(player);
            if (player.getRole(this.turn, this.players.length) == 'judging')
                this.unfinishedPlayers.push(player.name);
            if (this.currentBlackCard)
                updateCards(player.socketID, player.cards, this.currentBlackCard, player.getRole(this.turn, this.players.length));
            else
                return 'an unknown error occurred while drawing a black card';
        });
    }
    submitAnswer(id, submittedAnswer, startVoting) {
        let player = this.findPlayer(id);
        if (!player)
            return 'Player is not in a game room';
        if (this.phase != 'ANSWERING')
            return 'Game is not in the answering phase';
        if (this.playerAnswerMap.some(x => x[1] == id))
            return 'User has already submitted an answer';
        let randomID;
        do {
            randomID = Math.random().toString(36).substring(2, 7);
        } while (this.playerAnswerMap.some(x => x[0] == randomID));
        this.playerAnswerMap.push([randomID, id]);
        let answer = { id: randomID, cards: [] };
        submittedAnswer.forEach(card => {
            if (player) {
                let index = player.cards.findIndex(c => c.text == card.text);
                player.cards.splice(index, 1);
                answer.cards.push(card);
            }
        });
        answer.cards.sort((a, b) => a.order - b.order);
        this.answers.push(answer);
        this.unfinishedPlayers = this.unfinishedPlayers.filter(player => player != id);
        if (this.answers.length == this.players.length - 1) {
            this.phase = 'VOTING';
            let votingPlayer = this.players.find(p => p.getRole(this.turn, this.players.length) == 'voting');
            if (!votingPlayer)
                return 'an unknown error occurred while voting';
            this.unfinishedPlayers = [votingPlayer.name];
            startVoting(votingPlayer.socketID, this.answers);
        }
    }
    submitVoting(id, answerID, announceWinner) {
        let player = this.findPlayer(id);
        if (!player)
            return 'Player is not in this game';
        if (this.phase != 'VOTING')
            return 'Game is not in the voting phase';
        if (player.getRole(this.turn, this.players.length) != 'voting')
            return;
        let roundWinnerID = this.playerAnswerMap.find(x => x[0] == answerID)?.[1];
        if (!roundWinnerID)
            return 'an unknown error occurred while voting';
        let roundWinner = this.findPlayer(roundWinnerID);
        if (!roundWinner)
            return 'an unknown error occurred while voting';
        roundWinner.score += 1;
        if (this.currentBlackCard)
            announceWinner(roundWinner.name, this.currentBlackCard, this.answers, answerID);
        this.unfinishedPlayers = [];
        // Removes used cards
        this.answers.forEach(answer => {
            this.usedCards.white.push(...answer.cards.map(card => ({ text: card.text })));
        });
        this.drawBlackCard();
        this.playerAnswerMap = [];
        this.answers = [];
        this.turn += 1;
        this.phase = 'ANSWERING';
        this.players.forEach(p => {
            this.giveCards(p);
            if (p.getRole(this.turn, this.players.length) == 'judging')
                this.unfinishedPlayers.push(p.name);
        });
    }
    leaveRoom(id) {
        let player = this.findPlayer(id);
        if (!player)
            return;
        this.answers = this.answers.filter(el => el.id != player?.socketID);
        this.kickPlayer(player.socketID);
        if (this.answers.length == this.players.length - 1) {
            this.phase = 'VOTING';
            let votingPlayer = this.players.find(p => p.getRole(this.turn, this.players.length) == 'voting');
            if (!votingPlayer)
                return;
            this.unfinishedPlayers = [votingPlayer.name];
        }
    }
    hasPlayerName(username) {
        return this.players.some(x => x.name == username);
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
        player.cards = [...player.cards, ...this.pile.white.splice(0, 5 - player.cards.length)];
    }
    findPlayer(id) {
        return this.players.find(p => p.socketID == id);
    }
    getUnfinishedPlayers() {
        return this.unfinishedPlayers.map(p => this.findPlayer(p)?.name || "error");
    }
    getPlayerInfos() {
        return this.players.map(x => x.getInfo());
    }
    kickPlayer(id) {
        const order = this.players.find(p => p.socketID == id)?.order;
        if (order == undefined)
            return;
        this.players.forEach(element => {
            if (element.order > order)
                element.order -= 1;
        });
        this.players = this.players.filter(p => p.socketID != id);
    }
}
