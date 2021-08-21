<template>
  <div id="setUsername">
      <h1>Choose a Username</h1>
      <input type="text" name="username" id="username" min="3" max="48" v-model="username">
      <button @click="$emit('changeUsername', username, (e) => error = e)" id="usernameBtn">Submit</button>
      <p v-if="error" v-text="error" class="error"></p>
  </div>
</template>

<script>
export default {
  name: 'ChooseUsername',
  data() {
    return {
      username: '',
      error: ''
    }
  },
}
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
    column-gap: 1ch;
    row-gap: 2ch;
    grid-template-columns: 7fr 3fr;
    text-align: center;
  }
  #setUsername > h1{
    grid-column: span 2;
    white-space: nowrap;
  }
</style>
