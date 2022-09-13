<template>
    <Slider :min="0" :max="answers.length - 1" @change="(newItem) => item = newItem">
        <div class="cardStack heightFix">
            <Card v-for="card in answerStack[item.valueOf()].cards" :card="card" type="WHITE"></Card>
        </div>
    </Slider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Slider from "../components/Slider.vue";
import Card from "../components/Card.vue";
const item = ref<Number>(0)
function change(newItem: Number) {
    console.log(newItem);

    item.value = newItem
}

const answers = [{
    id: 1,
    cards: [
        { text: "test" }
    ]
},
{
    id: 2,
    cards: [{ text: "test2" }]
}, {
    id: 3, cards: [{ text: "test3" }]
}]
const answerStack = [{
    id: 1,
    cards: [
        { text: "test" },
    ]
},
{
    id: 2,
    cards: [{ text: "test2" }, { text: "layer1" }]
}, {
    id: 3, cards: [{ text: "with a really log text so that i can check the overflow" }, { text: "layer2" }, { text: "layer3" }]
}]
const cards = [{
    text: 'A'
},
{
    text: 'B'
},
{
    text: 'C'
},
{
    text: 'D'
},
{
    text: 'E'
},
{
    text: 'F'
},]
</script>

<style scoped>
.cardStack {
    display: grid;
    grid-row-gap: 1ch;
    grid-template-rows: repeat(auto-fit, minmax(100px, 1fr));
}
</style>