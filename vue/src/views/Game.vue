<template>
  <div v-if="renderComponent">
    <WinnerAnnouncement v-if="winner.show" :winner="winner" @hideAnnouncement="hideAnnouncement()"/>
    <ChooseUsername v-if="!isConnected" @changeUsername="joinRoom" roomID="oof"/>
    <div v-else class="gameOverlay">
      <div class="game" v-if="gemeIsRunning">
        <ChooseAwnser v-if="phase == 'awnsering' && (role == 'awnsering' && !finished)" v-bind:cards="handCards" :blackCard="blackCard" @toggleCard="toggleCard" @submitAwnser="submitAwnser"/>
        <WaitingMessage v-if="phase == 'awnsering' && (role == 'voting' || finished)" type="voting" :players="unfinishedPlayers" />
        <VoteAwnsers v-if="phase == 'voting' && role == 'voting'" @submitVotingCards="submitVotingCards"/>
        <WaitingMessage v-if="phase == 'voting' && role == 'awnsering'" type="finish" :players="unfinishedPlayers" />
      </div>
      <div v-else class="centerContent">
        <div v-if="isMaster" class="startScreen">
          <div class="shareId">
            <details> 
              <summary> Click to show the room id</summary>
              {{$route.params.roomID}}
              </details> 
            <p>copy link: <button @click="copyLink"><img :src="clipboardSVG" /></button></p>
          </div>
          <button @click="startGame" class="bigBtn">Start game</button>
        </div>
        <p v-else>
          Waiting for game Master to start
        </p>
      </div>
      <PlayerList :playerList="playerList" class="PlayerList"/>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import PlayerList from '../components/PlayerList.vue'
import ChooseUsername from '../components/ChooseUsername.vue'
import ChooseAwnser from '../components/ChooseAwnser.vue'
import VoteAwnsers from '../components/VoteAwnsers.vue'
import WinnerAnnouncement from '../components/WinnerAnnouncement.vue'
import WaitingMessage from '../components/WaitingMessage.vue'

import {io} from 'socket.io-client'

export default {
  name: 'Home',
  components: {
    ChooseUsername,
    PlayerList,
    ChooseAwnser,
    VoteAwnsers,
    WinnerAnnouncement,
    WaitingMessage
  },
  data() {
    return {
      renderComponent: true,
      clipboardSVG: require('../../public/clipboard.svg'),
      socket: io(), // 'localhost:3000'
      isConnected: false,
      isMaster: false,
      gemeIsRunning: false,
      playerList: [],
      handCards: [],
      voteAwnsers: [],
      unfinishedPlayers: [],
      finished: false,
      winner: {
        show: false,
        name: '',
        white: [],
        black: {}
      },
      role: 'TBS',
      phase: 'TBS',
      blackCard: {}

    }
  },
  created() {
    this.socket.on('update-users', (player) => {
      this.playerList = player
      this.playerList.sort((a,b) => a.order - b.order)
    })
    this.socket.on('update-cards', (cards, blackCard, role) => {
      this.handCards = cards.map( x => {return {selected: false, order: 0, ...x}})
      this.gemeIsRunning = true
      this.blackCard = blackCard
      this.role = role
      this.finished = false
      })
      this.socket.on('update-phase', (phase) => {
        this.phase = phase
      })
      this.socket.on('update-waiting', (unfinishedPlayers) => {
        this.unfinishedPlayers = unfinishedPlayers
      })
      this.socket.on('vote', (awnsers) => {
        this.voteAwnsers = awnsers
      })
      this.socket.on("WinnerAnnouncement", (username, blackCard, cards, winner) => {
        cards[0] = cards.splice(winner, 1, cards[0])[0];
        this.winner = {
          show: true,
          name: username,
          cards: cards,
          black: blackCard
        }
      })
      window.addEventListener('resize', () => {
        // Remove my-component from the DOM
        this.renderComponent = false;

        this.$nextTick(() => {
          // Add the component back in
          this.renderComponent = true;
        });
      })
  },
  methods: {
    joinRoom: function(username, reject) {
      this.socket.emit('join-room', this.$route.params.roomID, username, (msg) => {
        if('ok' in msg && msg.ok) {
          this.isConnected = true
          this.isMaster = msg.master
        } else
          reject(msg.error)
      })
    },
    startGame: function() {
      this.socket.emit('start-game', (msg) => {if(msg.error) alert(msg.error)})
    },
    toggleCard: function(key) {
      if(this.handCards[key].selected)
        this.handCards[key].selected = false
      else if(this.blackCard.pick > this.handCards.filter(x => x.selected).length){
        this.handCards[key].selected = true
        this.handCards[key].order = this.handCards.filter(x => x.selected).length
      }
    },
    submitVotingCards: function(key) {
      this.socket.emit('submitVoting', key)
    },
    submitAwnser: function() {
      if(this.blackCard.pick == this.handCards.filter(x => x.selected).length) {
        // emits all indexes of selected cards
        this.socket.emit('submitAwnser', this.handCards.filter(c => c.selected)
          .sort((a,b) => a.order-b.order)
          .map(c => {return {text:c.text, order: c.order}}),(accepted) => {this.finished = accepted})
      } else 
        alert('Not enough or too many cards selected')
    },
    hideAnnouncement: function() {
      this.winner.show = false
    },
    copyLink: function() {
      if (!navigator.clipboard) {
        alert("Your browser dosen't suport this feature");
      } else {
        navigator.clipboard.writeText(window.location.href).then( () => alert('Coppied to clipboard'))
        
      }
    } 
  },
}
</script>

<style scoped>
.gameOverlay {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 5em;
}
.startScreen {
  display: grid;
  gap: 2.5ch;
  grid-template-rows: 1fr 3fr;
}
.startScreen .shareId {
  display: flex;
  justify-content: space-around;
  align-items:baseline;
  height: 3em;
}
.startScreen .shareId button{
  background-color: transparent;
}
.bigBtn {
  font-size: 5em;
  max-width: 6em;
  max-height: 1.8em;
  background: whitesmoke;
  color: black;
}
.bigBtn:hover {
  /* color: tomato; */
    background-color: tomato;
}
</style>