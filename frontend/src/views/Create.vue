<template>
  <div class="create">
    <form action="/" @submit.prevent="createGame" method="post" v-if="!error">
      <div class="decks">
        <div v-for="(deck, key) in decks" v-bind:key="key">
          <label :for="key.toString()" v-text="deck.name"></label>
          <input type="checkbox" v-model="deck.selected" :id="key.toString()">
        </div>
      </div>
      <div class="upload">
        <p>Additionally you can upload your own Pack here: </p> <br><br>
        <input type="file" name="files" id="file" @change="updateFiles" accept=".json" multiple>
        for more information's visit <router-link to="/help">help</router-link>
      </div>
      <input type="submit" value="submit">
    </form>
    <div class="errorBox" v-else>
      <p>
        Opps you have encountered some error. <br>The server is not responding. Please try again later
      </p>
    </div>
    <div class="cardCount" v-if="!error">
      <p>Number of packs: {{ getCount().packs }}</p>
      <p>Number of white cards: {{getCount().white}}</p>
      <p>Number of black cards: {{getCount().black}}</p>
     </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Ajv from 'ajv'
import packSchema from '../scripts/packSchema.json'
import apiRequest from '@/scripts/apiRequest';
import router from '@/router/index.js';
interface SelectionDeck extends DeckInfo{
  selected: boolean
}
const ajv = new Ajv()
const validate = ajv.compile(packSchema)
const decks = ref<SelectionDeck[]>([])
const customDecks = ref<Deck[]>([])
const finishedReading = ref(true)
const error = ref('')
    
  
    function getCount() {
      let includedDecks = decks.value.filter(x => x.selected)
      includedDecks = [...includedDecks, ...customDecks.value.map( el => { return {
        name: el.name,
        selected: true,
        white: el.white.length,
        black: el.black.length
      }})]

      return {
        packs: includedDecks.length,
        white: includedDecks.reduce((acc, cur) => acc + cur.white, 0),
        black: includedDecks.reduce((acc, cur) => acc + cur.black, 0)
      }
    }
    async function fetchDecks() {
      try {
        const deckNames = await apiRequest('/decks', 'GET', undefined) as DeckInfo[]
        decks.value = deckNames.map(x => ({
          name: x.name,
          white: x.white,
          black: x.black,
          selected: false
        }))
      } catch(e: any) {
        error.value = e
      }
    }
    function updateFiles(event: any) {
      customDecks.value = []
      finishedReading.value = false

      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        let pack
        try {
          pack = JSON.parse(e?.target?.result as string)
          if(!validate(pack))
              throw 'In valid pack format'
        } catch (error) {
          customDecks.value = []
          event.target.value = ''
          console.error(error);
          alert("one of your files is not in the correct JSON format")
        }
        customDecks.value.push(pack);
        finishedReading.value = true
      })
      event.target.files.forEach((file: Blob) => {
        reader.readAsText(file)
      });
    }
    async function createGame() {
      try {
        const response = await apiRequest('/createGame', 'POST', {
          decks: decks.value.filter(x => x.selected).map(x => x.name),
          customDecks: customDecks.value
        })
        if(response.error)
          throw response.error
        if(response.roomID)
          router.push(`/game/${response.roomID}`);
        else
          error.value = 'An error occurred, the room may or may not have been created'
      } catch (e) {
        console.error(e);
        error.value = 'An error occurred, failed to create the room'
      }
    }
  onMounted(() => {
    fetchDecks()
  })
</script>

<style scoped>
  .create {
    display: grid;
    grid-template-rows: 1fr 3em;
  }
  form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
      width: 80%;
      text-align: center;
      margin: 0 auto;
  }
  form > * {
      width: 100%;
      margin: 1ch 0;
  }
  .decks {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 1ch;
      margin: .8em 0;
  }
  .decks > div {
      display: grid;
      grid-template-columns: 1fr 1em;
      column-gap: 1ch;
  }
  .cardCount {
    margin-top: .5em;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .cardCount > p:not(:last-child){
    margin-right: .7ch;
  }
  .cardCount > p:not(:last-child)::after {
    content: '|';
    margin-left: .7ch;
  }
  .upload {
    text-align: left;
  }
  .upload > *{
    display: inline;
    text-align: left;
  }

</style>