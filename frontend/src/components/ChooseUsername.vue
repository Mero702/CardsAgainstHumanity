<template>
  <div id="setUsername">
    <h1>Choose a Username</h1>
    <!-- eslint-disable-next-line -->
    <form action="" class="input pillInput"
      @submit.prevent="$emit('changeUsername', username, route.params.roomID.toString())">
      <input type="text" name="username" id="username" min="3" max="48" v-model="username" placeholder="username"
        required>
      <input type="submit" id="usernameBtn" value="Continue">
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
  width: max-content;
}

#setUsername>h1 {
  width: 100%;
  white-space: nowrap;
}

@media (max-width: 600px) {
  #setUsername {
    width: minmax(100vw, 32ch);
  }

}
</style>
