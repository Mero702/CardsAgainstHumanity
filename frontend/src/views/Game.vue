<template>
  <div v-if="renderComponent">
    <WinnerAnnouncement v-if="gameStore.$state.winner.show" :winner="gameStore.$state.winner" @hideAnnouncement="hideAnnouncement()"/>
    <ChooseUsername v-if="!gameStore.$state.isConnected" @changeUsername="joinRoom" roomID="oof"/>
    <div v-else class="gameOverlay">
      <div class="game" v-if="gameStore.$state.isGameRunning">
        <ChooseAnswer v-if="gameStore.$state.phase == 'ANSWERING' && (gameStore.$state.role == 'judging' && !gameStore.$state.finished)" 
          v-bind:cards="gameStore.$state.handCards"
          :blackCard="gameStore.$state.blackCard" 
          @toggleCard="toggleCard" 
          @submitAnswer="submitAnswer"
        />
        <WaitingMessage v-if="gameStore.$state.phase == 'ANSWERING' && (gameStore.$state.role == 'voting' || gameStore.$state.finished)" 
          type="VOTING" 
          :players="gameStore.$state.unfinishedPlayers"
        />
        <VoteAnswer v-if="gameStore.$state.phase == 'VOTING' && gameStore.$state.role == 'voting'" 
          @submitVotingCards="submitVotingCards"
        />
        <WaitingMessage v-if="gameStore.$state.phase == 'VOTING' && gameStore.$state.role == 'judging'"
          type="finish"
          :players="gameStore.$state.unfinishedPlayers"
        />
      </div>
      <div v-else class="centerContent">
        <div v-if="gameStore.$state.isMaster" class="startScreen">
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
      <PlayerList :playerList="gameStore.$state.playerList" class="PlayerList"/>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
// @ is an alias to /src
import {ref , onMounted, nextTick, watch} from 'vue'
import { useRoute } from 'vue-router'
import PlayerList from '../components/PlayerList.vue'
import ChooseUsername from '../components/ChooseUsername.vue'
import ChooseAnswer from '../components/ChooseAnswer.vue'
import VoteAnswer from '../components/VoteAnswer.vue'
import WinnerAnnouncement from '../components/WinnerAnnouncement.vue'
import WaitingMessage from '../components/WaitingMessage.vue'
import ClipBoardIcon from '../components/icons/ClipBoard.vue'

import {useGameStore} from '@/stores/GameStore'
import PreviewVue from './Preview.vue'

const gameStore = useGameStore()
gameStore.initSocket()

const route = useRoute()

const renderComponent = ref(true)

  onMounted(() => {
    window.addEventListener('resize', () => {
      // Remove my-component from the DOM
      renderComponent.value = false;

      nextTick(() => {
        // Add the component back in
        renderComponent.value = true;
      });
    })
  })
  function joinRoom(username: string, reject: CallableFunction) {
    let roomID = route.params.roomID.toString()
        
    gameStore.$state.socket.emit('joinRoom', roomID, username, (result) => {
      if(result.ok) {
        gameStore.$state.username = username
        gameStore.$state.room = roomID
        gameStore.$state.isConnected = true
        gameStore.$state.isMaster = result.isMaster
      }else {
        console.log(result);
        
        reject(result.error)
      }
    })
  }
  function startGame() {
    gameStore.$state.socket.emit('startGame', (result) => {if(!result.ok) alert(result.error)})
  }
  function toggleCard(key: number) {
    if(gameStore.$state.handCards[key].selected)
      gameStore.$state.handCards[key].selected = false
    else if(gameStore.$state.blackCard.pick > gameStore.$state.handCards.filter(x => x.selected).length){
      gameStore.$state.handCards[key].selected = true
      gameStore.$state.handCards[key].order = gameStore.$state.handCards.filter(x => x.selected).length
    }
  }
  function submitVotingCards(key: string) {
    gameStore.$state.socket.emit('submitVoting', key, (result) => {
      if(!result.ok) alert(result.error)
    })
  }
  function submitAnswer() {
    if(gameStore.$state.blackCard.pick == gameStore.$state.handCards.filter(x => x.selected).length) {
      // games all indexes of selected cards
      gameStore.$state.socket.emit('submitAnswer', gameStore.$state.handCards.filter(c => c.selected)
          .sort((a,b) => a.order-b.order)
          .map(c => {return {text:c.text, order: c.order}}),
        (result) => {
          if(result.ok) gameStore.$state.finished = true
          else alert(result.error)
        })
    } else 
      alert('Not enough or too many cards selected')
  }
  function hideAnnouncement() {
    gameStore.$state.winner.show = false
  }
  function copyLink() {
    if (!navigator.clipboard) {
      alert("Your browser doesn't support  feature");
    } else {
      navigator.clipboard.writeText(window.location.href).then( () => alert('Copied to clipboard'))
      
    }
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