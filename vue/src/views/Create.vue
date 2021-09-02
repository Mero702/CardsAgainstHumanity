<template>
  <div class="create">
    <form action="/" @submit.prevent="createGame" method="post" v-if="!error">
      <div class="decks">
        <div v-for="(deck, key) in decks" v-bind:key="key">
          <label :for="key" v-text="deck.name"></label>
          <input type="checkbox" v-model="deck.checked" :id="key">
        </div>
      </div>
      <input type="file" name="files" id="file" @change="updateFiles" accept=".json" multiple>
      <input type="submit" value="submit">
    </form>
    <div class="errorBox" v-else>
      <p>
        Opps you have encountert some error. <br>The server is not responding. Please try again later
      </p>
    </div>
    <div class="cardCount" v-if="!error">
      <p>Number of packs: {{ getPackCount }}</p>
      <p>Number of white cards: {{getWhiteCards}}</p>
      <p>Number of black cards: {{getBlackCards}}</p>
     </div>
  </div>
</template>

<script>
import apiRequest from '../scripts/apiRequest.js'
import Ajv from 'ajv'
import packSchema from '../scripts/packSchema'
export default {
  data() {
    return {
      decks: [],
      customDecks: [],
      finishedReading: true,
      error: ''
    }
  },computed: {
    getPackCount() {
      let includedDecks = this.decks.filter(x => x.checked)
      includedDecks = [...includedDecks, ...this.customDecks.map( el => { return {
        name: el.name
      }})]

      return includedDecks.length
    },
    getWhiteCards() {
      let includedDecks = this.decks.filter(x => x.checked)
      includedDecks = [...includedDecks, ...this.customDecks.map( el => { return {
        name: el.name,
        black: el.black.length,
        white: el.white.length
      }})]

       if(includedDecks.length > 0)
        return includedDecks.map(x => x.white).reduce((acc, x) => acc + x)
      return 0
    },
    getBlackCards() {
      let includedDecks = this.decks.filter(x => x.checked)
      includedDecks = [...includedDecks, ...this.customDecks.map( el => { return {
        name: el.name,
        black: el.black.length,
        white: el.white.length
      }})]

      if(includedDecks.length > 0)
        return includedDecks.map(x => x.black).reduce((acc, x) => acc + x)
      return 0
    }
  },
  methods: {
    fetchDecks: async function() {
      try {
        const deckNames = await apiRequest('create', 'GET', undefined)
        this.decks = deckNames.map(x => {return {name: x.name, white: x.white, black: x.black, checked: false}})
      } catch(e) {
        this.error = e
      }
    },
    updateFiles: function(event) {
      this.customDecks = []
      this.finishedReading = false

      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        let pack
        try {
          pack = JSON.parse(e.target.result)
          if(!this.validate(pack))
              throw 'In valid pack format'
        } catch (error) {
          this.customDecks = []
          event.target.value = ''
          console.error(error);
          alert("one of your files is not in the correct JSON format")
        }
        this.customDecks.push(pack);
        this.finishedReading = true
      })
      event.target.files.forEach(file => {
        reader.readAsText(file)
      });
    },
    createGame: async function() {
      try {
        const response = await apiRequest('create', 'POST', {
          decks: this.decks.filter(x => x.checked).map(x => x.name),
          customDecks: this.customDecks
        })
        if(response.error)
          throw response.error
        if(response.roomID)
          this.$router.push(`/game/${response.roomID}`);
        else
          this.error = 'An error occurred, the room may or may not have been created'
      } catch (e) {
        console.error(e);
        this.error = 'An error occurred, failed to create the room'
      }
    }
  },created() {
    this.fetchDecks()

    const ajv = new Ajv()
    this.validate = ajv.compile(packSchema)
  },
}
</script>

<style scoped>
  form {
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
</style>