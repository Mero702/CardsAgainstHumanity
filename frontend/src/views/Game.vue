<template>
  <div class="heightFix">
    <WinnerAnnouncement v-if="GameStore.$state.winner.show" :winner="GameStore.$state.winner" @hideAnnouncement="hideAnnouncement()"/>
    <ChooseUsername v-if="!GameStore.$state.isConnected" @changeUsername="joinRoom" roomID="oof"/>
    <GameOverlay v-else>
      <StartGame v-if="!GameStore.$state.isGameRunning"/>

      <ChooseAnswer v-else-if="GameStore.$state.phase == 'ANSWERING' && (GameStore.$state.role == 'judging' && !GameStore.$state.finished)"/>
      <WaitingMessage v-else-if="GameStore.$state.phase == 'ANSWERING' && (GameStore.$state.role == 'voting' || GameStore.$state.finished)" 
        type="VOTING" 
        :players="GameStore.$state.unfinishedPlayers"
      />

      <VoteAnswer v-else-if="GameStore.$state.phase == 'VOTING' && GameStore.$state.role == 'voting'"/>
      <WaitingMessage v-else-if="GameStore.$state.phase == 'VOTING' && GameStore.$state.role == 'judging'"
        type="ANSWERING"
        :players="GameStore.$state.unfinishedPlayers"
      />

    </GameOverlay>
  </div>
</template>

<script lang="ts" setup>
// @ is an alias to /src
// TODO: refresh roomID on change
import {ref , onMounted, nextTick, watch} from 'vue'
import { useRoute } from 'vue-router'
import ChooseUsername from '../components/ChooseUsername.vue'
import ChooseAnswer from '../components/ChooseAnswer.vue'
import VoteAnswer from '../components/VoteAnswer.vue'
import WinnerAnnouncement from '../components/WinnerAnnouncement.vue'
import WaitingMessage from '../components/WaitingMessage.vue'

import {useGameStore} from '@/stores/GameStore'
import GameOverlay from '../components/GameOverlay.vue'
import StartGame from '../components/StartGame.vue'

const GameStore = useGameStore()
GameStore.initSocket()

const route = useRoute()

  function joinRoom(username: string, reject: CallableFunction) {
    let roomID = route.params.roomID.toString()
        
    GameStore.$state.socket.emit('joinRoom', roomID, username, (result) => {
      if(result.ok) {
        GameStore.$state.username = username
        GameStore.$state.room = roomID
        GameStore.$state.isConnected = true
        GameStore.$state.isMaster = result.isMaster
      }else {
        console.log(result);
        
        reject(result.error)
      }
    })
  }

  function hideAnnouncement() {
    GameStore.$state.winner.show = false
  }
</script>