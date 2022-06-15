<template>
    <div class="gameOverlay">
        <slot class="gameContainer">
          Error
        </slot>
        <PlayerList :playerList="GameStore.$state.playerList" class="PlayerList"/>
    </div>
</template>

<script setup lang="ts">
import PlayerList from './PlayerList.vue';
import { useGameStore } from '@/stores/GameStore';

const GameStore = useGameStore()
</script>
<style>
.gameOverlay {
  height: 100%;
  width: 100%;
  overflow:hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 5em;
}
.gameOverlay {
  overflow: auto;
}
</style>

