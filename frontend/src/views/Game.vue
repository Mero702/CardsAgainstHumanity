<template>
  <div class="heightFix">
    <WinnerAnnouncement v-if="GameStore.$state.winner.show" :winner="GameStore.$state.winner"
      @hideAnnouncement="hideAnnouncement()" />
    <ChooseUsername v-if="!GameStore.$state.isConnected" @changeUsername="GameStore.joinRoom" />
    <GameOverlay v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChooseUsername from '../components/ChooseUsername.vue'
import WinnerAnnouncement from '../components/WinnerAnnouncement.vue'
import { useGameStore } from '@/stores/GameStore'
import GameOverlay from '../components/GameOverlay.vue'

const GameStore = useGameStore()
GameStore.initSocket()

const route = useRoute()

function hideAnnouncement() {
  GameStore.$state.winner.show = false
}
</script>