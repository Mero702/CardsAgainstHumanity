<template>
  <div class="home">
    <div class="join">
      <form action="/" class="pillInput" @submit.prevent="join">
        <input type="text" name="room-id" id="room-id" pattern="[A-Za-z0-9]{5}" v-model="roomId" placeholder="room id"
          required />
        <input type="submit" value="Join" />
      </form>
    </div>
    <div class="create">
      <p>
        <router-link to="/create"><button>New Game</button></router-link>
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
.home {
  width: 100vw;
  display: grid;
  grid-gap: 1em;
  justify-items: center;
  align-items: end;
  font-size: 1.4em;
}

.create {
  height: fit-content;
  /* grid-row: 2; */
}

.join {
  height: fit-content;
  flex-direction: column;
  justify-content: center;
  max-width: 30ch;
  /* grid-row: 2; */
}

.join>form>* {
  border: none;
  padding: 0.5ch;
}

@media(max-width: 600px) {
  .home {
    align-content: center;
    align-items: center;
  }

  .join>form {
    max-width: 100vw;
    grid-template-columns: 75% 25%;
  }
}

@media(min-width: 601px) {
  .home {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr fit-content(100%) 1fr;
    margin: 0 1ch;
  }

  .create,
  .join {
    grid-row: 2;
  }
}
</style>