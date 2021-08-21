<template>
  <div>
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
    WaitingForVoting
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
      this.handCards = cards.map( x => {return {selected: false, ...x}})
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
    // TODO somehow get blackcard
    // TODO get type of action 
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
      if(this.handCards[key].selected)
        this.handCards[key].selected = false
      else if(this.blackCard.pick > this.handCards.filter(x => x.selected).length)
        this.handCards[key].selected = true
    },
    submitVotingCards: function(key) {
      this.socket.emit('submitVoting', key)
    },
    submitAwnser: function() {
      if(this.blackCard.pick == this.handCards.filter(x => x.selected).length) {
        // emits all indexes of selected cards
        this.socket.emit('submitAwnser', this.handCards.reduce((acc, e, i) => {
          (e.selected) && acc.push(i)
          return acc;
        }, []))
      } else 
        alert('Not enough or too many cards selected')
    }
  },
}
</script>

<style scoped>
/* TODO change button style in general */
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