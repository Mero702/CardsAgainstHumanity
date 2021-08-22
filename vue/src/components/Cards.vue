<template>
    <div>
        <div v-if="!Array.isArray(cards[0])" class="deck">
            <div v-for="(card, key) in cards" :key="key" @click="$emit('toggleCard', key)">
                <Card :text="card.text" type="white" class="card" :isSelected="card.selected"/>
            </div>
        </div>
        <div v-else class="multiDeck">
            <div v-for="(cardStack, key) in cards" :key="key" @click="$emit('toggleCard', key)"  v-bind:class="{isSelected : cardStack.selected}" class="cardStack">
                <div v-for="(card, key2) in cardStack" :key="key2">
                    <Card :text="card.text" type="white" class="card"/>
                </div>
                <!-- <p v-text="c.text"></p> -->
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
    }
}
</script>

<style scoped>
.deck {
    display: flex;
    flex-wrap: column;
    justify-content: center;
}
.card {
    margin: 0 .5em;
}
.deck .card:hover, .cardStack:hover .card  {
    cursor: pointer;
    background: tomato;
}
.multiDeck{
    display: flex;
    flex-wrap: column;
}
.cardStack > *:not(:last-child) {
    margin-bottom: 1em;
}
.cardStack{
    margin: 0.5em;
}
.cardStack .card {
    margin: 0
}
</style>