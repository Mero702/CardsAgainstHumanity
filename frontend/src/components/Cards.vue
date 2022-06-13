<template>
    <div class="height">
        <div v-if="!Array.isArray(cards[0])" class="deck" :style="ItemCount">
            <div class="single" v-for="(card, key) in cards" :key="key" @click="$emit('toggleCard', key)">
                <Card :text="card.text" type="WHITE" :isSelected="card.selected"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps } from 'vue';
    import Card from './Card.vue'

    const props = defineProps<{
        cards: HandCard[]
        multiple?: boolean
    }>()

    function ItemCount() {
        return {
            '--cardCount':  props.cards.length || 5
        }
    }
    function SubItemCount() {
        return {
            '--cardCount': (Array.isArray(props.cards[0])) ? props.cards[0].length || 5 : 1
        }
    }
</script>

<style scoped>
.height {
    height: 100%;
    width: 100%;
}
.deck {
    --cardCount: 5;
    display: grid;
    column-gap: .5ch;
    grid-template-columns: repeat(var(--cardCount), 1fr);
    height: 100%;
    box-sizing: border-box;
}
.single {
    height: 100%;
    box-sizing: border-box;
}
.single > *{
    margin: 0 auto;
}
.deck .card:hover, .cardStack:hover .card  {
    cursor: pointer;
    background: tomato;
}
.cardStack {
    width: 100%;
    display: grid;
    row-gap: .5ch;
    grid-template-rows: repeat(var(--cardCount), 1fr);
}
.cardStack > * {
    margin: 0 auto;
}
</style>