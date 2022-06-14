<template>
    <div class="cardGrid" v-bind:class="{'double': GameStore.$state.blackCard.pick == 2, 'triple': GameStore.$state.blackCard.pick == 3}">
        <div class="TopCardContainer">
            <Card :text="GameStore.$state.blackCard.text" :pick="GameStore.$state.blackCard.pick" type="BLACK"/>
        </div>
        <div>
            <Cards :cards="GameStore.$state.votingAnswers" @toggleCard="$emit('toggleCard', $event)"/>
            <!-- 
                TODO: Implement voting component
                <Cards :multiple="GameStore.$state.blackCard.pick != 1" v-bind:cards="GameStore.$state.votingAnswers" @toggleCard="$emit('submitVotingCards', $event)"/> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import Card from '../components/Card.vue'
import Cards from './Cards.vue'

const GameStore = useGameStore()
const props = defineProps<{
    blackCard: BlackCard
    cards: Card[]
}>()
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