<template>
  <div>
        <WinnerAnnouncement v-if="winner.show" :winner="winner" @hideAnnouncement="hideAnnouncement()"/>
    <ChooseUsername v-if="!isConnected" @changeUsername="joinRoom" roomID="oof" />
    <div v-else class="gameOverlay">
      <div class="game" v-if="gemeIsRunning">
        <ChooseAwnser v-if="phase == 'awnsering' && role == 'awnsering'" v-bind:cards="handCards" :blackCard="blackCard" @toggleCard="toggleCard" @submitAwnser="submitAwnser"/>
        <WaitingForAwnsers v-if="phase == 'awnsering' && role == 'voting'"/>
        <VoteAwnsers v-if="phase == 'voting' && role == 'voting'" @submitVotingCards="submitVotingCards"/>
        <WaitingForVoting v-if="phase == 'voting' && role == 'awnsering'"/>
      </div>
      <div v-else>Waiting for game Master to start</div>
      <PlayerList :playerList="playerList" class="PlayerList"/>
      <!-- TODO Add save game button and functionality -->
      <MasterControlls @startGame="startGame" class="MasterControlls" v-if="isMaster"/>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import PlayerList from '../components/PlayerList.vue'
import ChooseUsername from '../components/ChooseUsername.vue'
import MasterControlls from '../components/MasterControlls.vue'
import ChooseAwnser from '../components/ChooseAwnser.vue'
import VoteAwnsers from '../components/VoteAwnsers.vue'
import WaitingForAwnsers from '../components/WaitigForAwnsers.vue'
import WaitingForVoting from '../components/WaitingForVoting.vue'
import WinnerAnnouncement from '../components/WinnerAnnouncement.vue'

import {io} from 'socket.io-client'

export default {
  name: 'Home',
  components: {
    ChooseUsername,
    PlayerList,
    MasterControlls,
    ChooseAwnser,
    VoteAwnsers,
    WaitingForAwnsers,
    WaitingForVoting,
    WinnerAnnouncement
  },
  data() {
    return {
      socket: io('http://localhost:3000'),
      isConnected: false,
      isMaster: false,
      gemeIsRunning: false,
      playerList: [],
      handCards: [],
      voteAwnsers: [],
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
      })
      this.socket.on('update-phase', (phase) => {
        this.phase = phase
      })
      this.socket.on('vote', (awnsers) => {
        this.voteAwnsers = awnsers
      })
      this.socket.on("WinnerAnnouncement", (username, blackCard, whiteCards) => {
        this.winner = {
          show: true,
          name: username,
          white: whiteCards,
          black: blackCard
        }
      } )
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
      this.socket.emit('start-game', (msg) => console.log(msg))
    },
    toggleCard: function(key) {
      console.log(key);
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
          .map(c => {return {text:c.text, order: c.order}}))
      } else 
        alert('Not enough or too many cards selected')
    },
    hideAnnouncement: function() {
      this.winner.show = false
    } 
  },
}
</script>

<style scoped>
.gameOverlay {
  height: 100%;
  display: grid;
  grid-template-areas: "Game Game"
                        "PlayerList Controlls";
  grid-template-rows: 9fr 1fr;
  grid-template-columns: 7fr 3fr;
}
.game {
  grid-area: Game;
}
.MasterControlls {
  grid-area: Controlls;
}
.PlayerList {
  grid-area: PlayerList;
}
</style>