<template>
  <div class="grid">
    <div id="nav">
      <router-link to="/">Home</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
html, body, #app, .grid {
  height: 100vh;
  width: 100vw;
  font-family: 'Open Sans', Arial, sans-serif;
  background: #2C313A;
  color: #c0c0c0;
}
* {
  padding: 0;
  margin: 0;
}
#nav {
  padding: 30px;
  text-align: center;
  font-size: 1.25em;
  background: #282C34;
}

#nav a {
  font-weight: bold;
  color: #42b983;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.grid { 
  display: grid;
  grid-template-rows: 1fr 14fr;
}
.error {
  color:rgb(194, 0, 0);
}
</style>
