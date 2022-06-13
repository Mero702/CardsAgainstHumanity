<template>
    <div class="cardGrid">
        <div>
            <Card :text="$parent.blackCard.text" :pick="$parent.blackCard.pick" type="black" class="TopCard"/>
        </div>
        <div>
            <Cards v-bind:cards="$parent.handCards" @toggleCard="$emit('toggleCard', $event)"/>
        </div>
        <button class="submit" @click="$emit('submitAnswer')"> Submit </button>
    </div>
</template>

<script>
import Card from './Card.vue'
import Cards from './Cards.vue'

export default {
    name: 'ChooseAnswer',
    porps: ['cards', 'blackCard'],
    components: {
        Cards,
        Card
    },
}
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