// ANCHOR remove uuid
const fs = require('fs')
const getRandomOrder = require('./scripts/getRandomOrder')
const GameManager = require('./game/GameManager')
const Ajv = require('ajv')
const ajv = new Ajv()
const packSchema = require('./scripts/packSchema')
const validate = ajv.compile(packSchema)

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
})// ANCHOR remove for deployment
const port = process.env.PORT || 3000

const cors = require('cors')// ANCHOR remove for deployment
app.use(express.json());
app.use(cors())
app.use('/', express.static(__dirname+'/public'))

var gameManager = new GameManager()

app.get('/create', (req, res) => {
  let rawdata = fs.readFileSync(__dirname + '/decks/cah-cards-full.json')
  let pecks = JSON.parse(rawdata).map(x => {return {
    name: x.name,
    white: x.white.length,
    black: x.black.length
  }})
  res.json(pecks)
})

app.post('/create', (req, res) => {
  if(!'decks' in req.body)
    return res.json({error: 'no decks selected'})
  let packNames = req.body.decks
  let rawdata = fs.readFileSync(__dirname + '/decks/cah-cards-full.json')
  let packs = JSON.parse(rawdata).filter(x => packNames.includes(x.name))
  let deck = {black: [], white: []}
  packs.forEach(pack => {
    deck.black = deck.black.concat(pack.black)
    deck.white = deck.white.concat(pack.white)
  })
  if('customDecks' in req.body)
  {
    let customPacks = req.body.customDecks
    if(!validate(customPacks))
      return res.json({error: 'no decks selected'})
    customPacks.forEach(pack => {
      deck.black = deck.black.concat(pack.black)
      deck.white = deck.white.concat(pack.white)
    })
  }
  let id
  do {
    id = (Math.random() + 1).toString(36).substring(5)
  } while(gameManager.ifGameExist(id))
  gameManager.createGame(id, deck)
  res.json({roomID: id})
})
io.on('connection', (socket) => {
  socket.on('join-room', (room, username, callback) => {
    // rejects a client who is already participating in a room
    if([...socket.rooms.keys()].some(x => x.includes('room-')))
      return callback({error: 'User is allready playing a CAH game'})
    if(!gameManager.ifGameExist(room))
      return callback({error: `No game with the id "${room}" found`})

    let game = gameManager.findGame(room)

    if(game.phase != 'TBS')
      return callback({error: `The game with the id "${room}" has alredy started`})
      
    if(game.hasPlayerName(username))
      return callback({error: 'Username is already taken'})

    socket.username = username
    socket.isMaster = false
    // adds the master "rolle" to the first one who joins
    if(!io.of('/').adapter.rooms.has(`room-${room}`)) {
      socket.join(`master`);
      socket.isMaster = true
    }

    game.addPlayer(socket.id, username, socket.isMaster)
    socket.join(`room-${room}`)
    socket.room = room
    
    io.to(`room-${room}`).emit('update-users', game.players.map(x => x.getInfo()))
    return callback({ok: true, master: socket.isMaster})
  })
  socket.on('start-game', (callback) => {
    let game = gameManager.findGame(socket.room)

    if(!game)
      return callback({error: 'No game found'})
    if(game.phase != 'TBS')
      return callback({error: 'game already started'})
    if(game.players.length < 3)
      return callback({error: 'you need at least 3 Players'})

    game.shuffleCards()
    game.drawBlackCard()
    game.phase = 'awnsering'

    let randomID = getRandomOrder(game.players.length)
    game.players.forEach(player => {
      player.order = randomID.next().value
      game.giveCards(player)
      if(player.getRole(game.turn, game.players.length) == 'awnsering')
        game.unfinishedPlayers.push(player.name)

      io.to(player.socketID).emit('update-cards', player.cards, game.currentBlackCard, player.getRole(game.turn, game.players.length))
    })
    io.to(`room-${socket.room}`).emit('update-phase', game.phase)
    io.to(`room-${socket.room}`).emit('update-waiting', game.unfinishedPlayers)
    io.to(`room-${socket.room}`).emit('update-users', game.players.map(x => x.getInfo()))
    callback({ok: true});
  })
  socket.on('submitAwnser', (cards, callback) => {
    let game = gameManager.findGame(socket.room)
    if(!game)
      return;
    let player = game.findPlayer(socket.id)
    
    if(game.answers.some(x => x.id == socket.id))
      return;

    let awnser = {id: player.socketID, cards: []}
    cards.forEach(card => {
      let index = player.cards.findIndex(c => c.text == card.text)
      player.cards.splice(index, 1)
      awnser.cards.push(card)
    })
    awnser.cards.sort((a,b) => a.order-b.order)
    game.answers.push(awnser)
    game.unfinishedPlayers = game.unfinishedPlayers.filter(player => player != socket.username)
    io.to(`room-${socket.room}`).emit('update-waiting', game.unfinishedPlayers)
    if(game.answers.length == game.players.length - 1)
      {
        game.phase = 'voting'
        let votingPlayer = game.players.find(p => p.getRole(game.turn, game.players.length) == 'voting')

        io.to(votingPlayer.socketID).emit('vote', game.answers.map(x => x.cards))
        io.to(`room-${socket.room}`).emit('update-phase', game.phase)

        game.unfinishedPlayers = votingPlayer.name
        io.to(`room-${socket.room}`).emit('update-waiting', game.unfinishedPlayers)
      }
      callback(true)
  })
  socket.on('submitVoting', (cards) => {
    let game = gameManager.findGame(socket.room)
    if(!game)
      return;
    let player = game.findPlayer(socket.id)

    if(player.getRole(game.turn, game.players.length) != 'voting')
    return;
    
    let roundWinner = game.findPlayer(game.answers[cards].id)
    roundWinner.score += 1
    io.to(`room-${socket.room}`).emit('update-users', game.players.map(x => x.getInfo()))
    io.to(`room-${socket.room}`).emit('WinnerAnnouncement', roundWinner.name, game.currentBlackCard, game.answers[cards].cards)

    game.unfinishedPlayers = []
    // Removes used cards
    game.answers.forEach( awnser => {
      game.usedCards.white.push(awnser.cards)
    })
    game.drawBlackCard()
    game.answers = []
    game.turn += 1
    game.phase = 'awnsering'

    game.players.forEach(p => {
      game.giveCards(p)
      io.to(p.socketID).emit('update-cards', p.cards, game.currentBlackCard, p.getRole(game.turn, game.players.length))

      if(p.getRole(game.turn, game.players.length) == 'awnsering')
        game.unfinishedPlayers.push(p.name)
    })
    io.to(`room-${socket.room}`).emit('update-waiting', game.unfinishedPlayers)
    io.to(`room-${socket.room}`).emit('update-phase', game.phase)
  })
  socket.on("disconnect", (reason) => {
    let game = gameManager.findGame(socket.room)
    if(!game)
      return;
    let player = game.findPlayer(socket.id)

    game.answers = game.answers.filter(el => el.id != player.socketID)

    game.kickPlayer(player.socketID)
    io.to(`room-${socket.room}`).emit('update-users', game.players.map(x => x.getInfo()))

    if(game.answers.length == game.players.length - 1)
    {
      game.phase = 'voting'
      let votingPlayer = game.players.find(p => p.getRole(game.turn, game.players.length) == 'voting')

      io.to(votingPlayer.socketID).emit('vote', game.answers.map(x => x.cards))
      io.to(`room-${socket.room}`).emit('update-phase', game.phase)

      game.unfinishedPlayers = votingPlayer.name
      io.to(`room-${socket.room}`).emit('update-waiting', game.unfinishedPlayers)
    }
  })
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})
