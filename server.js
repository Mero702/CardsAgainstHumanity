const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const getRandomOrder = require('./scripts/getRandomOrder')
const shuffleArray = require('./scripts/shuffleArray')

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
})// ANCHOR remove for deployment
const port = process.env.PORT || 3000

//TODO only if game or room exist
// TODO: npm uninstall bodyParser
const cors = require('cors')// ANCHOR remove for deployment
app.use(express.json());
app.use(cors())

global.games = []

app.get('/create', (req, res) => {
  // TODO send number of cards in each deck
  let rawdata = fs.readFileSync(__dirname + '/decks/cah-cards-full.json')
  let pecks = JSON.parse(rawdata).map(x => {return {
    name: x.name,
    white: x.white.length,
    black: x.black.length
  }})
  res.json(pecks)
})

// TODO add user fileupload for custom decks decks
app.post('/create', (req, res) => {
  if(!'decks' in req.body)
    return res.json({error: 'no decks selected'})
  let packNames = req.body.decks
  let rawdata = fs.readFileSync(__dirname + '/decks/cah-cards-full.json')
  let packs = JSON.parse(rawdata).filter(x => packNames.includes(x.name))
  // TODO make this better
  let deck = packs.reduce((x, el) => { return {
    black: [...x.black, el.black], 
    white: [...x.white, ...el.white]
  }})
  const id = uuidv4()
  global.games.push({
    phase: 'TBS',
    uuid: id,
    pile: deck,
    turn: 1,
    usedCards: {black: [], white:[]},
    answers: [],
    players: []
  })
  res.json({roomID: id})
})

io.on('connection', (socket) => {
  // TODO: handle disconnect
  socket.on('join-room', (room, username, callback) => {
    // rejects a client who is already participating in a room
    if([...socket.rooms.keys()].some(x => x.includes('room-')))
      return callback({error: 'User is allready playing a CAH game'})

    if(!global.games.some(x => x.uuid == room))
      return callback({error: `No game with the id "${room}" found`})

    let game = global.games.find(x => x.uuid == room)
    
    if(game.phase != 'TBS')
      return callback({error: `The game with the id "${room}" has alredy started`})
    
    if(game.players.some(x => x.name == username))
      return callback({error: 'Username is already taken'})

    socket.username = username
    socket.master = false
    // adds the master "rolle" to the first one who joins
    if(!io.of('/').adapter.rooms.has(`room-${room}`)) {
      socket.join(`master`);
      socket.master = true
    }

    game.players.push({
      name: username,
      socketID: socket.id, 
      master: socket.master,
      order: 0,
      score: 0
    })
    socket.join(`room-${room}`)
    socket.room = room
    
    io.to(`room-${room}`).emit('update-users', game.players.map(x => {return{
      name: x.name,
      master: x.master,
      order: x.order,
      score: x.score
    }}))
    return callback({ok: true, master: socket.master})
  })
  socket.on('start-game', (callback) => {
    let game = global.games.find(x => x.uuid == socket.room)

    if(game.phase != 'TBS')
      return callback({error: 'game already started'})
    if(game.players.length < 3)
      return callback({error: 'you need at least 3 Players'})

    game.pile.black = shuffleArray(game.pile.black)
    game.pile.white = shuffleArray(game.pile.white)
    game.currentBlackCard = game.pile.black.shift()
    game.phase = 'awnsering'

    let randomID = getRandomOrder(game.players.length)
    let votingPlayerID = (game.turn-1)%game.players.length+1
    game.players.forEach(x => {
      x.order = randomID.next().value
      x.cards = game.pile.white.splice(0, 5)
      x.role = (x.order == votingPlayerID) ? 'voting' : 'awnsering'
      io.to(x.socketID).emit('update-cards', x.cards, game.currentBlackCard, x.role)
    })
    io.to(`room-${socket.room}`).emit('update-phase', game.phase)
    io.to(`room-${socket.room}`).emit('update-users', game.players.map(x => {return{
      name: x.name,
      master: x.master,
      order: x.order,
      score: x.score
    }}))
    callback({ok: true});
  })
  socket.on('submitAwnser', (cards) => {
    let game = global.games.find(x => x.uuid == socket.room)
    let player = game.players.find(p => p.socketID == socket.id)
    
    if(game.answers.some(x => x.id == socket.id))
      return;

    let awnser = {id: player.socketID, cards: []}
    cards.forEach(card => {
      // usedCards.white.push(player.cards.splice(card, 1))
      awnser.cards.unshift(...player.cards.splice(card, 1))
    })
    game.answers.push(awnser)
    if(game.answers.length == game.players.length - 1)
      {
        game.phase = 'voting'
        let votingPlayer = game.players.find(p => p.role == 'voting')
        io.to(votingPlayer.socketID).emit('vote', game.answers.map(x => x.cards))
        io.to(`room-${socket.room}`).emit('update-phase', game.phase)
      }
  })
  socket.on('submitVoting', (cards) => {
    let game = global.games.find(x => x.uuid == socket.room)
    // TODO add check if player is the one who votes
    // TODO add announcement who wone
    let roundWinner = game.players.find(p => p.socketID == game.answers[cards].id)
    roundWinner.score += 1
    io.to(`room-${socket.room}`).emit('update-users', game.players.map(x => {return{
      name: x.name,
      master: x.master,
      order: x.order,
      score: x.score
    }}))

    // Removes used cards
    game.usedCards.black = game.currentBlackCard
    game.answers.forEach( awnser => {
      let player = game.players.find(p => p.socketID == awnser.id)
      awnser.cards.forEach( card => {
        game.usedCards.white.push(player.cards.splice(player.cards.findIndex(c => c.text == card.text),1))
      })
    })
    game.currentBlackCard = game.pile.black.shift()
    game.answers = []
    game.turn += 1
    game.phase = 'awnsering'

    let votingPlayerID = (game.turn-1)%game.players.length+1
    console.log(votingPlayerID)
    game.players.forEach(x => {
      x.cards =[...x.cards, ...game.pile.white.splice(0, 5 - x.cards.length)]
      x.role = (x.order == votingPlayerID) ? 'voting' : 'awnsering'
      io.to(x.socketID).emit('update-cards', x.cards, game.currentBlackCard, x.role)
    })
    io.to(`room-${socket.room}`).emit('update-phase', game.phase)
  })
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})
