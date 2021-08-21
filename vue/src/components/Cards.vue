<template>
    <div class="deck">
        <div v-for="(card, key) in cards" :key="key" class="card" v-bind:class="{isSelected : card.selected}" @click="$emit('toggleCard', key)">
            <p v-if="!multiple" v-text="card.text"></p>
            <p v-else v-for="(c, key2) in card" v-text="c.text" :key="key2"></p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Cards',
    props: ['cards', 'multiple'],
}
</script>

<style  scoped>
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
.card:hover {
    cursor: pointer;
    outline: purple 3px solid;
}
.card.isSelected {
    /* TODO change selected card style */
    background: tomato;
}
</style>