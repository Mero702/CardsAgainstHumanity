<template>
  <div class="home">
    <div class="join">
      <p>Join a room</p>
      <form action="/" class="pillInput" @submit.prevent="join">
        <input type="text" name="room-id" id="room-id" pattern="[A-Za-z0-9]{5}" v-model="roomId" placeholder="room id"
          required />
        <input type="submit" value="join" />
      </form>
    </div>
    <div class="create">
      <p>
        <router-link to="/create"><button>Create a room</button></router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import router from "@/router/index";

const roomId = ref("");

function join() {
  router.push(`/game/${roomId.value.toLowerCase()}`);
}
</script>

<style scoped>
/* TODO: fix height difference  between sides*/
.home {
  font-size: 1.4em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
  grid-template-rows: 1fr fit-content(100%) 1fr;
  justify-items: center;
  align-items: end;
}

.create {
  height: fit-content;
  grid-row: 2;
}

.join {
  height: fit-content;
  flex-direction: column;
  justify-content: center;
  gap: 2ch;
  max-width: 30ch;
  grid-row: 2;
}

.join form {
  padding-top: 1ch;
  display: grid;
  grid-template-columns: 4fr 1fr;
}

.join>form>* {
  box-sizing: border-box;
  border: none;
  padding: 0.5ch;
}
</style>