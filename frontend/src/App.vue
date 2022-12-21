<!-- TODO: Minimize navbar if mobile/tablet are rotated -->

<template>
  <div>
    <ErrorBox />
    <div class="grid">
      <div id="nav">
        <router-link to="/">Home</router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
// TODO: change vote selection to horizontal if multiple cards
// TODO: bug in player leave (clears card of not left player)
// TODO: refactor css
// TODO: submit button is cut of in voting view
import '@/assets/scrollbar.css'

import { useGameStore } from "./stores/GameStore";
import ErrorBox from "./components/ErrorBox.vue";
import { watch } from "vue";
import { useRoute } from "vue-router";
const GameStore = useGameStore();

const route = useRoute();
watch(() => route.params?.roomID, () => {
  console.log(route.params?.roomID);

  if (GameStore.$state.isConnected && route.params?.roomID != undefined && route.params?.roomID != GameStore.$state.game.room) {
    GameStore.$reset();
  }
})
</script>

<style>
@import url('@/assets/base.css');

html,
body,
#app,
.grid {
  height: 100vh;
  width: 100vw;
  background: var(--background-color);
  overflow: overlay;
}

#nav {
  padding: 30px;
  text-align: center;
  font-size: 1.25em;
  background: var(--background-color-header);
}

.grid {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 1fr minmax(0, 14fr);
}

.centerContent {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fragment {
  margin: 0;
  padding: 0;
}
</style>