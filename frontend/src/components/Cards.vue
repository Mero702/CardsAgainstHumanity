<template>
    <div class="deck">
        <div 
            v-for="(card, key) in cards"
            :key="key"
            :class="{
                'single': !('id' in card && card.cards.length > 1),
                'cardStack': ('id' in card && card.cards.length > 1)
            }"
            @click="$emit('toggleCard', ('id' in card) ? card.id : key)"
            v-bind:class="{isSelected : ('cards' in card && card.cards.length > 1) && card.selected}"
        >
        <Card v-if="'text' in card" :text="card.text" type="WHITE" :isSelected="card.selected"/>
        <Card v-else v-for="(subCard, key) in card.cards" :key="key" :text="subCard.text" type="WHITE"/>

        </div>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps } from 'vue';
    import Card from './Card.vue'

    const props = defineProps<{
        cards: Selectable<HandCard|Answer>[]
    }>()
</script>

<style scoped>
.deck {
    height: 100%;
    width: 100%;

    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    grid-column-gap: .5ch;
}
.deck > * {
    height: 100%;
    overflow: auto;
}
.cardStack {
    display: grid;
    grid-auto-rows: 1fr;
    grid-auto-flow: row;
    grid-row-gap:.5ch;
}
</style>