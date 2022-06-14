<template class="awoo">
    <div v-bind:class="{white: type == 'WHITE', black: type == 'BLACK', isSelected: isSelected}" class="card" v-if="renderComponent" >
        <p v-text="text" class="text"></p>
        <p v-text="'pick: '+pick" class="pick" v-if="pick"></p>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, nextTick } from 'vue';

const props = defineProps<{
    type: 'WHITE' | 'BLACK'
    text: string
    pick?: number
    isSelected?: boolean
}>()
const renderComponent = ref(true)
</script>

<style scoped>
.card {
    width: 100%;
    max-height: 100%;
    margin: auto auto;
    aspect-ratio: 63 / 88;
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
}
.pick {
    align-self: flex-end;
}
.card > p {
    word-break:keep-all;
}
.white {
    background: whitesmoke;
    color: black;
}
.black {
    background: black;
    color: whitesmoke;
}
.card.isSelected {
    box-shadow: 1px -2px 0px 3px tomato inset;
}
</style>