<template>
    <div class="cards">
        <BlackCard :card="$parent.blackCard"/>
        <Cards :multiple="true" v-bind:cards="$parent.voteAwnsers" @toggleCard="$emit('submitVotingCards', $event)"/>
    </div>
</template>

<script>
import BlackCard from '../components/BlackCard.vue'
import Cards from './Cards.vue'

export default {
    name: 'ChooseAwnser',
    porps: ['cards', 'blackCard'],
    components: {
        Cards,
        BlackCard
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