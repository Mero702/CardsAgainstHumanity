<template>
  <div id="setUsername">
      <h1>Choose a Username</h1>
      <form action="" class="input" @submit.prevent="$emit('changeUsername', username, (e:any) => error = e)">
        <input class="val" type="text" name="username" id="username" min="3" max="48" v-model="username" placeholder="username" required>
        <input type="submit" class="sub" id="usernameBtn">
      </form>
      <p v-if="error" v-text="error" class="error"></p>
  </div>
</template>

<script lang="ts" setup>
//TODO: make a global error handling with stores
import { ref } from 'vue';

const username = ref('')
const error = ref('')
</script>

<style>
  #setUsername {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  #setUsername {
    display: grid;
    row-gap: 2ch;
    grid-template-rows: 1fr 1fr;
    text-align: center;
  }
  #setUsername > h1{
    grid-column: span 2;
    white-space: nowrap;
  }
  .input {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-column: span 2;
    width: 100%;
  }
  .input > * {
    height: 100%;
    box-sizing: border-box;
    padding: 0;
  }
  .input > .val{
    padding: .2ch .6ch;
    border-top-left-radius: 1em;
    border-bottom-left-radius: 1em;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border: none;
  }
  
  .input > .sub{
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
    background-color: tomato;
  }
</style>
