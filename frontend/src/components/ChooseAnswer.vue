<template>
    <div class="cardGrid">
        <div>
            <Card :text="GameStore.$state.blackCard.text" :pick="GameStore.$state.blackCard.pick" type="BLACK" class="TopCard"/>
        </div>
        <div>
            <Cards :cards="GameStore.$state.handCards" @toggleCard="$emit('toggleCard', $event)"/>
        </div>
        <button class="submit" @click="$emit('submitAnswer')"> Submit </button>
    </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import Card from './Card.vue'
import Cards from './Cards.vue'
const GameStore = useGameStore()
</script>

<style scoped>
.cardGrid {
    display: grid;
    grid-template-rows: 5fr 5fr 3em;
    height: 100%;
    row-gap: 1ch;
}
.cardGrid > div {
    height: 100%;
}
.TopCard {
    margin: 0 auto;
}
.submit {
    width: 12em;
    height: 2.5em;
}
button {
    margin: 0 auto;
}
</style>