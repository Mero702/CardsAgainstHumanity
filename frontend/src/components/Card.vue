<template>
    <div v-bind:class="{ white: type == 'WHITE', black: type == 'BLACK', isSelected: isSelected }" class="card">
        <p v-text="card.text" class="text"></p>
        <p v-if="'pick' in card" v-text="'pick: ' + card.pick" class="pick"></p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps<{
    type: 'WHITE' | 'BLACK'
    card: WhiteCard | BlackCard
    isSelected?: boolean
}>()
</script>

<style scoped>
.card {
    /* resizing with aspect ratio and 66% pure magic */
    max-width: 100%;
    height: 100%;
    aspect-ratio: 63 / 88;

    margin: auto auto;
    position: relative;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    padding: 1em;
    font-size: 1.2em;
    border-radius: .8em;
    overflow: auto;
    justify-content: space-between;
    text-align: left;

    background-color: var(--card-background);
}

.pick {
    align-self: flex-end;
}

.card>p {
    word-break: keep-all;
    color: var(--card-color);
}

.white {
    --card-color: black;
    --card-background: whitesmoke;
}

.black {
    --card-color: whitesmoke;
    --card-background: black;
}


.card.isSelected {
    box-shadow: 1px -2px 0px 3px tomato inset;
}
</style>