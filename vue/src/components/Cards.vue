<template>
    <div>
        <div v-if="!Array.isArray(cards[0])" class="deck">
            <div v-for="(card, key) in cards" :key="key" class="card" v-bind:class="{isSelected : card.selected}" @click="$emit('toggleCard', key)">
                <p v-text="card.text"></p>
            </div>
        </div>
        <div v-else class="multiDeck">
            <div v-for="(cardStack, key) in cards" :key="key" @click="$emit('toggleCard', key)"  v-bind:class="{isSelected : cardStack.selected}" class="cardStack">
                <div v-for="(card, key2) in cardStack" :key="key2" class="card">
                    <p v-text="card.text"></p>
                </div>
                <!-- <p v-text="c.text"></p> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Cards',
    props: ['cards', 'multiple'],
}
</script>

<style scoped>
.multiDeck{
    display: flex;
    flex-wrap: column;
}
.cardStack > .card:not(:last-child) {
    margin-bottom: 1em;
}
.deck {
    display: flex;
    flex-wrap: column;
    justify-content: center;
}
.card {
    background: whitesmoke;
    color: black;
    width: 12em;
    height: 7em;
    margin: 0 .5em;
    text-align: center;
}
.cardStack{
    margin: 0.5em;
}
.cardStack > .card {
    margin: 0
}
.deck > .card:hover, .cardStack:hover  {
    cursor: pointer;
    outline: purple 3px solid;
}
.card.isSelected {
    /* TODO change selected card style */
    background: tomato;
}
</style>