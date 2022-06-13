import Express, { Application, Request, Response } from "express";
import {createServer} from "http";
import { Server, Socket } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import Ajv from "ajv";

import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, GameSocketData } from "../types/GameSocketIOTypes"
import DeckManager from "./game/DeckManager";
import DeckLoader from "./game/DeckLoader";
import GameManager from "./game/GameManager";
import { getRandomOrder } from "./game/utils";

const app: Application = Express();
const server = createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, GameSocketData>(server
  , {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
}
)

const port: number = (process.env.PORT || 3000) as number;
const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)))


if (true || process.env.NODE_ENV == "development") {
  console.log("Running in development mode")
  const cors = await import('cors')
  app.use(cors.default())
}


app.use(Express.json())
app.use('/', Express.static(__dirname+'/public'))

const ajv = new Ajv();

const CustomDecksSchema = await import('./CustomDeckSchema.json')
const validateCustomDecks = ajv.compile(CustomDecksSchema);

const decks = new DeckManager(path.join(__dirname, "/decks/cah-cards-full.json"))
const gameManager = new GameManager()

app.get('/api/decks', (req: Request, res: Response) => {
  res.json(decks.getDeckInfos())
})
app.post('/api/createGame', (req: Request, res: Response) => {
  if (!('decks' in req.body || 'customDecks' in req.body))
    return res.status(400).json({ error: "No decks selected" })

  const deckLoader = new DeckLoader()
  if ('decks' in req.body) {
    deckLoader.addDecks(req.body.decks, decks)
  }
  if ('customDecks' in req.body) {
    const customDecks = req.body.customDecks
    if (validateCustomDecks(customDecks))
      deckLoader.addCustomDecks(req.body.customDecks)
    else
      return res.status(400).json({ error: "Invalid custom deck Format" })
  }
  // TODO: Test for minimal number of cards
  let id = gameManager.createGame(deckLoader.getDeck())
  res.json({roomID: id})
})

io.on('connection', (socket) => {
  socket.on('joinRoom', (room, username, callback) => {
    // rejects a client who is already participating in a room
    if ([...socket.rooms.keys()].some(x => x.includes('room-')))
      return callback({ ok: false, isMaster: false, error: 'User is already playing a CAH game' })

    let game = gameManager.findGame(room)
    if (!game) return callback({ ok: false, isMaster: false, error: `No game with the id "${room}" found` })

    let playerStatus = game.addPlayer(socket.id, username)
    if (playerStatus.error)
      return callback({ ok: false, isMaster: false, error: playerStatus.error })

    socket.data.username = username
    socket.data.isMaster = playerStatus.isMaster
    if (playerStatus.isMaster)
      socket.join(`master`);

    socket.join(`room-${room}`)
    socket.data.room = room

    io.to(`room-${room}`).emit('updateUsers', game.getPlayerInfos())
    return callback({ ok: true, isMaster: socket.data.isMaster || false })
  })

  socket.on('startGame', (callback) => {
    let game = gameManager.findGame(socket.data.room)
    if (!game)
      return callback({ ok: false, error: 'No game found' })

    let error = game.startGame((socketID, cards, card, role) =>
      io.to(socketID).emit('updateCards', cards, card, role)
    )
    if (error)
      return callback({ ok: false, error })

    io.to(`room-${socket.data.room}`).emit('updatePhase', game.phase)
    io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)
    io.to(`room-${socket.data.room}`).emit('updateUsers', game.players.map(x => x.getInfo()))
    callback({ ok: true });
  })

  socket.on('submitAnswer', (cards, callback) => {
    let game = gameManager.findGame(socket.data.room)
    if (!game)
      return callback({ ok: false, error: `No game with the id '${socket.data.room}' found` })

    game.submitAnswer(socket.id, cards, (votingPlayer, cards) => io.to(votingPlayer).emit('voting', cards))

    io.to(`room-${socket.data.room}`).emit('updateWaiting', game.getUnfinishedPlayers() || ["error"])
    io.to(`room-${socket.data.room}`).emit('updatePhase', game.phase)
    io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)

    callback({ ok: true })
  })

  socket.on('submitVoting', (answerID, callback) => {
    let game = gameManager.findGame(socket.data.room)
    if (!game)
      return callback({ ok: false, error: `No game with the id '${socket.data.room}' found` })

    game.submitVoting(socket.id, answerID, (winnerName, blackCard, answers, answerID) => 
      io.to(`room-${socket.data.room}`).emit('WinnerAnnouncement', winnerName, blackCard, answers, answerID)
    )

    game.players.forEach(p => {
      if(game && game.currentBlackCard)
      io.to(p.socketID).emit('updateCards', p.cards, game.currentBlackCard, p.getRole(game.turn, game.players.length))
    })

    io.to(`room-${socket.data.room}`).emit('updateUsers', game.players.map(x => x.getInfo()))
    io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)
    io.to(`room-${socket.data.room}`).emit('updatePhase', game.phase)
  })

  socket.on("leaveRoom", () => {
    let game = gameManager.findGame(socket.data.room)
    if (!game)
      return;
    game.leaveRoom(socket.id)
  //@ts-ignore
    let votingPlayer = game.players.find(p => p.getRole(game.turn, game.players.length) == 'voting')
    if (votingPlayer)
      io.to(votingPlayer.socketID).emit('voting', game.answers)
      io.to(`room-${socket.data.room}`).emit('updateUsers', game.players.map(x => x.getInfo()))
      io.to(`room-${socket.data.room}`).emit('updatePhase', game.phase)
      io.to(`room-${socket.data.room}`).emit('updateWaiting', game.unfinishedPlayers)

    })
})
server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
})