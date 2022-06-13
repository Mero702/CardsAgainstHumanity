<template>
  <div v-if="renderComponent">
    <WinnerAnnouncement v-if="winner.show" :winner="winner" @hideAnnouncement="hideAnnouncement()"/>
    <ChooseUsername v-if="!isConnected" @changeUsername="joinRoom" roomID="oof"/>
    <div v-else class="gameOverlay">
      <div class="game" v-if="gameIsRunning">
        <ChooseAnswer v-if="phase == 'answering' && (role == 'answering' && !finished)" v-bind:cards="handCards" :blackCard="blackCard" @toggleCard="toggleCard" @submitAnswer="submitAnswer"/>
        <WaitingMessage v-if="phase == 'answering' && (role == 'voting' || finished)" type="voting" :players="unfinishedPlayers" />
        <VoteAnswer v-if="phase == 'voting' && role == 'voting'" @submitVotingCards="submitVotingCards"/>
        <WaitingMessage v-if="phase == 'voting' && role == 'answering'" type="finish" :players="unfinishedPlayers" />
      </div>
      <div v-else class="centerContent">
        <div v-if="isMaster" class="startScreen">
          <div class="shareId">
            <details> 
              <summary> Click to show the room id</summary>
              {{$route.params.roomID}}
              </details> 
            <p>copy link: <button @click="copyLink"> <ClipBoardIcon /> </button></p>
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

<script lang="ts" setup>
// @ is an alias to /src
import {ref , onMounted} from 'vue'
import PlayerList from '../components/PlayerList.vue'
import ChooseUsername from '../components/ChooseUsername.vue'
import ChooseAnswer from '../components/ChooseAnswer.vue'
import VoteAnswer from '../components/VoteAnswer.vue'
import WinnerAnnouncement from '../components/WinnerAnnouncement.vue'
import WaitingMessage from '../components/WaitingMessage.vue'
import ClipBoardIcon from '../components/icons/ClipBoard.vue'

import {useGameStore} from '@/stores/GameStore'
const gameStore = useGameStore()


  onMounted(() => {
    socket.on('update-users', (player) => {
      playerList = player
      playerList.sort((a,b) => a.order - b.order)
    })
    socket.on('update-cards', (cards, blackCard, role) => {
      handCards = cards.map( x => {return {selected: false, order: 0, ...x}})
      gameIsRunning = true
      blackCard = blackCard
      role = role
      finished = false
      })
      socket.on('update-phase', (phase) => {
        phase = phase
      })
      socket.on('update-waiting', (unfinishedPlayers) => {
        unfinishedPlayers = unfinishedPlayers
      })
      socket.on('vote', (answer) => {
        voteAnswer = answer
      })
      socket.on("WinnerAnnouncement", (username, blackCard, cards, winner) => {
        cards[0] = cards.splice(winner, 1, cards[0])[0];
        winner = {
          show: true,
          name: username,
          cards: cards,
          black: blackCard
        }
      })
      window.addEventListener('resize', () => {
        // Remove my-component from the DOM
        renderComponent = false;

        $nextTick(() => {
          // Add the component back in
          renderComponent = true;
        });
      })
  })
  methods: {
    joinRoom: function(username, reject) {
      .socket.game('joinRoom', .$route.params.roomID, username, (msg) => {
        if('ok' in msg && msg.ok) {
          .isConnected = true
          .isMaster = msg.master
        } else
          reject(msg.error)
      })
    },
    startGame: function() {
      .socket.game('startGame', (msg) => {if(msg.error) alert(msg.error)})
    },
    toggleCard: function(key) {
      if(.handCards[key].selected)
        .handCards[key].selected = false
      else if(.blackCard.pick > .handCards.filter(x => x.selected).length){
        .handCards[key].selected = true
        .handCards[key].order = .handCards.filter(x => x.selected).length
      }
    },
    submitVotingCards: function(key) {
      .socket.game('submitVoting', key)
    },
    submitAnswer: function() {
      if(.blackCard.pick == .handCards.filter(x => x.selected).length) {
        // games all indexes of selected cards
        .socket.game('submitAnswer', .handCards.filter(c => c.selected)
          .sort((a,b) => a.order-b.order)
          .map(c => {return {text:c.text, order: c.order}}),(accepted) => {.finished = accepted})
      } else 
        alert('Not enough or too many cards selected')
    },
    hideAnnouncement: function() {
      .winner.show = false
    },
    copyLink: function() {
      if (!navigator.clipboard) {
        alert("Your browser dosen't suport  feature");
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