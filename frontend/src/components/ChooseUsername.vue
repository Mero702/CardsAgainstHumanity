<template>
  <div id="setUsername">
    <h1>Choose a Username</h1>
    <!-- eslint-disable-next-line -->
    <form action="" class="input pillInput"
      @submit.prevent="$emit('changeUsername', username, route.params.roomID.toString())">
      <input type="text" name="username" id="username" min="3" max="48" v-model="username" placeholder="username"
        required>
      <input type="submit" id="usernameBtn">
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const username = ref('')
</script>

<style>
#setUsername {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  row-gap: 2ch;
  grid-template-rows: 1fr 1fr;
  text-align: center;
}

#setUsername>h1 {
  width: 100%;
  grid-column: span 2;
  white-space: nowrap;
}

.input {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-column: span 2;
  width: 100%;
}

.input>* {
  height: 100%;
  box-sizing: border-box;
  border: none;
}

@media (min-width: 600px) {
  #setUsername {
    width: 100vw;
  }

}
</style>
