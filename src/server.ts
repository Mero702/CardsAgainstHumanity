import Express, { Application, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import Ajv from "ajv";

import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, GameSocketData } from "../types/GameSocketIOTypes"
import DeckManager from "./game/DeckManager";
import DeckLoader from "./game/DeckLoader";
import GameManager from "./game/GameManager";
import { getRandomOrder } from "./game/utils";

const app:Application = Express();
const http = createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, GameSocketData>(http)

const port:number = (process.env.PORT || 3000) as number;
const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)))


if(process.env.NODE_ENV == "development") {
    console.log("Running in development mode")    
    const cors = await import('cors')
    app.use(cors.default())
}


app.use(Express.json())
// app.use('/', Express.static(__dirname+'/public'))

const ajv = new Ajv();

const CustomDecksSchema = await import('./CustomDeckSchema.json')
const validateCustomDecks = ajv.compile(CustomDecksSchema);

const decks = new DeckManager(path.join(__dirname,"/decks/cah-cards-full.json"))
const gameManager = new GameManager()

app.get('/decks', (req: Request, res:Response) => {
    res.json(decks.getDeckInfos())
})
app.post('/createGame', (req: Request, res:Response) => {
    if(!('decks' in req.body || 'customDecks' in req.body))
        return res.status(400).json({error: "No decks selected"})

    const deckLoader = new DeckLoader()
    if('decks' in req.body) {
        deckLoader.addDecks(req.body.decks, decks)
    }
    if('customDecks' in req.body) {
        const customDecks = req.body.customDecks
        if(validateCustomDecks(customDecks))
            deckLoader.addCustomDecks(req.body.customDecks)
        else
            return res.status(400).json({error: "Invalid custom deck Format"})
    }
    // TODO: Test for minimal number of cards
    gameManager.createGame(deckLoader.getDeck())
})

io.on('connection', (socket) => {
    socket.on('joinRoom', (room, username, callback) => {
      // rejects a client who is already participating in a room
      if([...socket.rooms.keys()].some(x => x.includes('room-')))
        return callback({ok:false, isMaster:false, error: 'User is already playing a CAH game'})

      let game = gameManager.findGame(room)
      if (!game) return callback({ok:false, isMaster:false, error: `No game with the id "${room}" found`})
  
      if(game.phase != 'TBS')
        return callback({ok:false, isMaster:false, error: `The game with the id "${room}" has already started`})
        
      if(game.hasPlayerName(username))
        return callback({ok:false, isMaster:false, error: 'Username is already taken'})
  
      socket.data.username = username
      socket.data.isMaster = false
      // adds the master "role" to the first one who joins
      if(!io.of('/').adapter.rooms.has(`room-${room}`)) {
        socket.join(`master`);
        socket.data.isMaster = true
      }
  
      game.addPlayer(socket.id, username, socket.data.isMaster)
      socket.join(`room-${room}`)
      socket.data.room = room
      
      io.to(`room-${room}`).emit('updateUsers', game.players.map(x => x.getInfo()))
      return callback({ok:true, isMaster:socket.data.isMaster})
    })

    socket.on('startGame', (callback) => {
        if(!socket.data.room)
            return callback({ok: false, error: 'No game found'})
      let game = gameManager.findGame(socket.data.room)
  
      if(!game)
        return callback({ok: false, error: 'No game found'})
    
      if(game.phase != 'TBS')
        return callback({ok: false, error: 'game already started'})
      if(game.players.length < 3)
        return callback({ok: false, error: 'you need at least 3 Players'})
  
      game.shuffleCards()
      game.drawBlackCard()
      game.phase = 'ANSWERING'
  
      let randomID = getRandomOrder(game.players.length)
      game.players.forEach(player => {
        player.order = randomID.next().value||0
        if(game) {
            game.giveCards(player)
            if(player.getRole(game.turn, game.players.length) == 'judging')
            game.unfinishedPlayers.push(player.name)
            if(game.currentBlackCard)
                io.to(player.socketID).emit('updateCards', player.cards, game.currentBlackCard, player.getRole(game.turn, game.players.length))
            else
                return callback({ok: false, error: 'an unknown error occurred while drawing a black card'})
        }})
      io.to(`room-${socket.data.room}`).emit('updatePhase', game.phase)
      io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)
      io.to(`room-${socket.data.room}`).emit('updateUsers', game.players.map(x => x.getInfo()))
      callback({ok: true});
    })

    socket.on('submitAnswer', (cards, callback) => {
        if(!socket.data.room)
            return callback({ok: false, error: 'Player is not in a game room'})
      let game = gameManager.findGame(socket.data.room)
      if(!game)
        return;
      let player = game.findPlayer(socket.id)
      if(!player)
        return callback({ok: false, error: 'Player is not in a game room'});
      if(game.answers.some(x => x.id == socket.id))
        return;
        
      let answer: answerCards = {id: player.socketID, cards: []}
      cards.forEach(card => {
          if(player) {
            let index = player.cards.findIndex(c => c.text == card.text)
            player.cards.splice(index, 1)
            answer.cards.push(card)
          }
      })
      answer.cards.sort((a,b) => a.order-b.order)
      game.answers.push(answer)

      game.unfinishedPlayers = game.unfinishedPlayers.filter(player => player != socket.data.username)
      io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)

      if( game && game.answers.length == game.players.length - 1)
        {
          game.phase = 'VOTING'
          let votingPlayer = game.players.find(p => p.getRole(game.turn, game.players.length) == 'voting')
            if(!votingPlayer)
            return callback({ok: false, error: 'an unknown error occurred while voting'})
          io.to(votingPlayer.socketID).emit('voting', game.answers.map((x:Answer) => x.cards))
          io.to(`room-${socket.data.room}`).emit('updatePhase', game.phase)
  
          game.unfinishedPlayers = [votingPlayer.name]
          io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)
        }
        callback({ok: true})
    })

    socket.on('submitVoting', (cards) => {
        if(!socket.data.room)
            return;
      let game = gameManager.findGame(socket.data.room)
      if(!game)
        return;
      let player = game.findPlayer(socket.id)
        if(!player)
            return;
      if(player.getRole(game.turn, game.players.length) != 'voting')
      return;
      
      let roundWinner = game.findPlayer(game.answers[cards].id)
      if(!roundWinner)
        return;
      roundWinner.score += 1
      io.to(`room-${socket.data.room}`).emit('updateUsers', game.players.map(x => x.getInfo()))
      io.to(`room-${socket.data.room}`).emit('WinnerAnnouncement', roundWinner.name, game.currentBlackCard, game.answers, cards)
  
      game.unfinishedPlayers = []
      // Removes used cards
      game.answers.forEach( awnser => {
        game.usedCards.white.push(awnser.cards)
      })
      game.drawBlackCard()
      game.answers = []
      game.turn += 1
      game.phase = 'ANSWERING'
  
      game.players.forEach(p => {
        if(!game)
            return;
        game.giveCards(p)
        io.to(p.socketID).emit('updateCards', p.cards, game.currentBlackCard, p.getRole(game.turn, game.players.length))
  
        if(p.getRole(game.turn, game.players.length) == 'awnsering')
          game.unfinishedPlayers.push(p.name)
      })
      io.to(`room-${socket.room}`).emit('update-waiting', game.unfinishedPlayers)
      io.to(`room-${socket.room}`).emit('update-phase', game.phase)
    })
    socket.on("leaveRoom", () => {
        if(!socket.data.room)
            return;
      let game = gameManager.findGame(socket.data.room)
      if(!game)
        return;
      let player = game.findPlayer(socket.id)
        if(!player)
            return;
      game.answers = game.answers.filter(el => el.id != player.socketID)
  
      game.kickPlayer(player.socketID)
      io.to(`room-${socket.data.room}`).emit('updateUsers', game.players.map(x => x.getInfo()))
  
      if(game.answers.length == game.players.length - 1)
      {
        game.phase = 'VOTING'
        let votingPlayer = game.players.find(p => p.getRole(game.turn, game.players.length) == 'voting')
        if(!votingPlayer)
            return;
        io.to(votingPlayer.socketID).emit('voting', game.answers.map(x => x.cards))
        io.to(`room-${socket.data.room}`).emit('updatePhase', game.phase)
  
        game.unfinishedPlayers = [votingPlayer.name]
        io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)
      }
    })
  })
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
})