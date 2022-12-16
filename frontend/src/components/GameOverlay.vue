<template>
  <div class="gameOverlay">
    <div class="gameContainer heightFix">
      <GameViewStart v-if="GameStore.$state.game.phase == 'TBS' && GameStore.$state.user.isHost" />
      <div v-else-if="GameStore.$state.game.phase == 'TBS'">Waiting for host to Start</div>
      <ChooseAnswer v-else-if="GameStore.$state.game.phase == 'ANSWERING'" />
      <VoteAnswer v-else-if="GameStore.$state.game.phase == 'VOTING' && GameStore.$state.user.role == 'VOTING'" />
      <ChooseAnswer v-else-if="GameStore.$state.game.phase == 'VOTING' && GameStore.$state.user.role != 'VOTING'" />

    </div>
    <PlayerList :playerList="GameStore.$state.game.playerList" class="PlayerList" />
  </div>
</template>

<script setup lang="ts">
import GameViewStart from './GameViewStart.vue';
import ChooseAnswer from './ChooseAnswer.vue';
import VoteAnswer from './VoteAnswer.vue';
import PlayerList from './PlayerList.vue';
import { useGameStore } from '@/stores/GameStore';

const GameStore = useGameStore()
</script>
<style>
.gameOverlay {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr fit-content(100%);
}
</style>

