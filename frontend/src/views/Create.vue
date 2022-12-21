<template>
  <div class="create">
    <form action="/" @submit.prevent="createGame" method="post">
      <div v-if="!upload" class="selection">
        <div class="decks">
          <div v-for="(deck, key) in decks" v-bind:key="key">
            <label :for="key.toString()" v-text="deck.name" :title="deck.name"></label>
            <input type="checkbox" v-model="deck.selected" :id="key.toString()" />
          </div>
        </div>
        <!-- TODO: style file upload if possible -->
        <div class="customDecks">
          <input type="checkbox" id="includeCustomDecks" v-model="includeCustomDecks">
          <label for="includeCustomDecks">Include Custom decks</label>
        </div>
      </div>

      <div class="upload" v-else>
        <p><a @click="upload = false">Back</a></p><br>
        <Help :shortened="true" /> <br>
        <label for="file">Upload your custom pack:</label>
        <br />
        <input type="file" name="files" id="file" @change="updateFiles" accept=".json" multiple />
        <br>
        <input type="button" value="Remove custom decks" @click="customDecks = []">
      </div>

      <input type="submit" value="Create" class="createBtn" v-if="!includeCustomDecks || upload" />
      <input type="submit" value="Upload" class="createBtn" v-else @click.prevent="upload = true" />
    </form>
    <div class="cardCount">
      <p :style="{ color: (getCount().packs < 1) ? 'var(--accent-color)' : 'var(--color)' }">Packs: {{
          getCount().packs
      }}</p>
      <p :style="{ color: (getCount().white < 25) ? 'var(--accent-color)' : 'var(--color)' }">White cards: {{
          getCount().white
      }}
      </p>
      <p :style="{ color: (getCount().black < 3) ? 'var(--accent-color)' : 'var(--color)' }">Black cards: {{
          getCount().black
      }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import router from "@/router/index.js";
import { useGameStore } from "@/stores/GameStore";

import Ajv from "ajv";
import packSchema from "@/scripts/packSchema.json";
import apiRequest from "@/scripts/apiRequest";
import Help from "./Help.vue";

const ajv = new Ajv();
const validate = ajv.compile(packSchema);

const includeCustomDecks = ref(false);
const upload = ref(false);
const decks = ref<Selectable<DeckInfo>[]>([]);
const customDecks = ref<Deck[]>([]);
const finishedReading = ref(true);

const GameStore = useGameStore();

function getCount() {
  let includedDecks = decks.value.filter((x) => x.selected);
  includedDecks = [
    ...includedDecks,
    ...customDecks.value.map((el) => {
      return {
        name: el.name,
        selected: true,
        white: el.white.length,
        black: el.black.length,
      };
    }),
  ];

  return {
    packs: includedDecks.length,
    white: includedDecks.reduce((acc, cur) => acc + cur.white, 0),
    black: includedDecks.reduce((acc, cur) => acc + cur.black, 0),
  };
}
async function fetchDecks() {
  try {
    const deckNames = (await apiRequest(
      "/decks",
      "GET",
      undefined
    )) as DeckInfo[];
    decks.value = deckNames.map((x) => ({
      name: x.name,
      white: x.white,
      black: x.black,
      selected: false,
    }));
  } catch (e: any) {
    console.error(e)
    GameStore.$state.error = e;
  }
}
function updateFiles(event: any) {
  customDecks.value = [];
  finishedReading.value = false;

  const reader = new FileReader();
  reader.addEventListener("load", (e) => {
    let pack;
    try {
      pack = JSON.parse(e?.target?.result as string);
      if (!validate(pack)) throw "In valid pack format";
    } catch (error) {
      customDecks.value = [];
      event.target.value = "";
      GameStore.$state.error =
        "one of your files is not in the correct JSON format";
    }
    customDecks.value.push(pack);
    finishedReading.value = true;
  });
  event.target.files.forEach((file: Blob) => {
    reader.readAsText(file);
  });
}
async function createGame() {
  const response = await apiRequest("/createGame", "POST", {
    decks: decks.value.filter((x) => x.selected).map((x) => x.name),
    customDecks: customDecks.value,
  });

  if (response.error) GameStore.$state.error = response.error;
  if (response.roomID) router.push(`/game/${response.roomID}`);
}

onMounted(() => {
  fetchDecks();
});
</script>

<style lang="scss" scoped>
@import url("@/assets/scrollbar.css");

.create,
form,
.selection {
  display: grid;
  grid-template-rows: minmax(0, 1fr) fit-content(3em);
}

form {
  display: grid;
  max-width: 90ch;
  text-align: center;
  margin: 0 auto;
  padding: 0 1ch;
}

.decks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28ch, 1fr));
  column-gap: 1ch;
  row-gap: 0.25ch;
  margin: 0.8em 0;
  overflow: auto;
}

.decks>div {
  display: grid;
  grid-template-columns: 1fr 1em;
  column-gap: 1ch;
  align-items: center;

}

.decks>div>label {
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.createBtn {
  width: fit-content;
  margin: 1ch auto;
  font-size: x-large;
}

.cardCount {
  margin: 0 auto;
  margin-top: 0.5em;
  max-width: 90ch;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 1ch;
}

.cardCount>p {
  white-space: nowrap;
}

.cardCount>p:not(:last-child) {
  margin-right: 0.7ch;
}

.cardCount>p:not(:last-child)::after {
  content: '';
  margin: 0 1ch;
  border: 1px solid var(--color);
  border-radius: 1em;
}


.upload {
  text-align: left;
}

.upload>* {
  display: inline;
  text-align: left;
}

.customDecks {
  display: flex;
  align-items: center;
}

.customDecks input {
  margin-right: 1ch;
}
</style>