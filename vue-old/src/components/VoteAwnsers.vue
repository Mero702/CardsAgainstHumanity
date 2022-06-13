<template>
    <div class="cardGrid" v-bind:class="{'double': $parent.blackCard.pick == 2, 'triple': $parent.blackCard.pick == 3}">
        <div class="TopCardContainer">
            <Card :text="$parent.blackCard.text" :pick="$parent.blackCard.pick" type="black"/>
        </div>
        <div>
            <Cards :multiple="$parent.blackCard.pick != 1" v-bind:cards="$parent.voteAwnsers" @toggleCard="$emit('submitVotingCards', $event)"/>
        </div>
    </div>
</template>

<script>
import Card from '../components/Card.vue'
import Cards from './Cards.vue'

export default {
    name: 'ChooseAwnser',
    porps: ['cards', 'blackCard'],
    components: {
        Card,
        Cards
    },
}
</script>

<style scoped>
.cardGrid {
    display: grid;
    grid-template-rows: 1fr 1fr;
    height: 100%;
    row-gap: .5ch;
}
.cardGrid > * {
    height: 100%;
    width: 100%;
    margin: 0 auto;
}
.cardGrid.double {
    grid-template-rows: 1fr 2fr;
}
.cardGrid.tripple {
    grid-template-rows: 1fr 3fr;
}
.TopCardContainer > * {
    margin: 0 auto;
}
</style>