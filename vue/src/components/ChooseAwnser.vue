<template>
    <div class="cards">
        <Card :text="$parent.blackCard.text" :pick="$parent.blackCard.pick" type="black"/>
        <Cards v-bind:cards="$parent.handCards" @toggleCard="$emit('toggleCard', $event)"/>
        <button class="submit" @click="$emit('submitAwnser')"> Submit </button>
    </div>
</template>

<script>
import Card from './Card.vue'
import Cards from './Cards.vue'

export default {
    name: 'ChooseAwnser',
    porps: ['cards', 'blackCard'],
    components: {
        Cards,
        Card
    },
}
</script>

<style scoped>
.cards {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100%;
}
.submit {
    width: 12em;
    height: 2.5em;
}
</style>