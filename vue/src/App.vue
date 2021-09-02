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
@font-face {
  font-family: Helvetica-Bold;
  src: url(/Helvetica-Bold.ttf);
}
html, body, #app, .grid {
  height: 100vh;
  width: 100vw;
  font-family: Helvetica-Bold;
  /* font-family: 'Open Sans', Arial, sans-serif; */
  background: #2C313A;
  color: #c0c0c0;
  overflow: overlay;
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

a {
  color: tomato;
}

a.router-link-exact-active {
  color: tomato;
}
.grid { 
  display: grid;
  grid-template-rows: 1fr 14fr;
}
.error {
  color:rgb(194, 0, 0);
}

button, input[type=submit] {
  background: whitesmoke;
  color: black;
  border: none;
  border-radius: .8em;
  padding: .4ch;
  font-size: 1.2em;
  cursor: pointer;
}
button:hover,input[type=submit]:hover {
  background: tomato;
}
label:hover {
  color: tomato;
}
.errorBox {
  font-size: 1.8em;
  margin: .5em;
}
.errorBox::before {
  color: tomato;
  content: 'Error:';
}
.centerContent {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
