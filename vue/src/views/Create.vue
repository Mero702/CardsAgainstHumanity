<template>
  <div class="create">
    <form action="/" @submit.prevent="createGame" method="post" v-if="!error">
      <div class="decks">
        <div v-for="(deck, key) in decks" v-bind:key="key">
          <label :for="key" v-text="deck.name"></label>
          <input type="checkbox" v-model="deck.checked" :id="key">
        </div>
      </div>
      <input type="submit" value="submit">
      <p>Number of white cards: {{getWhiteCards}}</p>
      <p>Number of black cards: {{getBlackCards}}</p>
    </form>
    <div class="error-box" v-else>
      <p>
        Opps you have encountert some error
      </p>
    </div>
  </div>
</template>

<script>
import apiRequest from '../scripts/apiRequest.js'
export default {
  data() {
    return {
      decks: [],
      error: ''
    }
  },computed: {
    getWhiteCards() {
       if(this.decks.filter(x => x.checked).length > 0)
        return this.decks.filter(x => x.checked).map(x => x.white).reduce((acc, x) => acc + x)
      return 0
    },
    getBlackCards() {
      if(this.decks.filter(x => x.checked).length > 0)
        return this.decks.filter(x => x.checked).map(x => x.black).reduce((acc, x) => acc + x)
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
    createGame: async function() {
      try {
        const response = await apiRequest('create', 'POST', {
          decks: this.decks.filter(x => x.checked).map(x => x.name)
        })
        if(response.error)
          throw response.error
        if(response.roomID)
          this.$router.push(`/game/${response.roomID}`);
        else
          this.error = 'An error occurred, the room may or may not have been created'
      } catch (e) {
        console.log(e);
        this.error = 'An error occurred, failed to create the room'
      }
    }
  },created() {
    this.fetchDecks()
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
    </style>