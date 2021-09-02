<template>
    <div class="height">
        <div v-if="!Array.isArray(cards[0])" class="deck" :style="ItemCount">
            <div class="single" v-for="(card, key) in cards" :key="key" @click="$emit('toggleCard', key)">
                <Card :text="card.text" type="white" :isSelected="card.selected"/>
            </div>
        </div>
        <div v-else class="deck" :style="ItemCount">
            <div v-for="(cardStack, key) in cards" :key="key" @click="$emit('toggleCard', key)"  v-bind:class="{isSelected : cardStack.selected}" :style="SubItemCount" class="cardStack">
                <Card v-for="(card, key2) in cardStack" :key="key2" :text="card.text" type="white"/>
            </div>
        </div>
    </div>
</template>

<script>
import Card from './Card.vue'
export default {
    name: 'Cards',
    props: ['cards', 'multiple'],
    components: {
        Card
    },
    computed: {
        ItemCount() {
            return {
                '--cardCount':  this.cards.length || 5
            }
        },
        SubItemCount() {
            return {
                '--cardCount': (Array.isArray(this.cards[0])) ? this.cards[0].length || 5 : 1
            }
        },
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