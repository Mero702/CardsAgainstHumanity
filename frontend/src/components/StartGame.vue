<template>
    <div class="centerContent">
        <div v-if="GameStore.$state.isMaster" class="startScreen">
          <div class="shareId">
            <details> 
              <summary> Click to show the room id</summary>
              {{$route.params.roomID}}
              </details> 
            <p>copy link: <button @click="copyLink"> <ClipBoardIcon /> </button></p>
          </div>
          <button @click="GameStore.startGame" class="bigBtn">Start game</button>
        </div>
        <p v-else>
          Waiting for game Master to start
        </p>
    </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import ClipBoardIcon from '@/components/icons/ClipBoard.vue'

const GameStore = useGameStore()
  function copyLink() {
    if (!navigator.clipboard) {
      alert("Your browser doesn't support  feature");
    } else {
      navigator.clipboard.writeText(window.location.href).then( () => alert('Copied to clipboard'))
      
    }
  } 
</script>

<style>
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