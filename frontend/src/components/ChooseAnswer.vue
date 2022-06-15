<template>
    <div class="cardGrid" :style="{'--multiplier' : cardCount()}">
        <Card :card="GameStore.$state.blackCard" type="BLACK" ref="displayedBlackCard" class="displayedBlackCard"/>
        <div class="heightFix">
            <Cards :cards="GameStore.$state.handCards" @toggleCard="GameStore.selectCard"/>
        </div>
        <button class="submit" @click="GameStore.submitAnswer" :style="{'--width': BlackCardWith+'px'}"> Submit </button>
    </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import Card from '@/components/Card.vue'
import Cards from '@/components/Cards.vue'
import { ref, onMounted } from 'vue';

const GameStore = useGameStore()

const BlackCardWith = ref(0)
function updateSelection(key: string) {
    let index = parseInt(key)
    GameStore.$state.handCards[index].selected = !GameStore.$state.handCards[index].selected
}
function cardCount() {
    return '1fr';
}

onMounted(() => {
    BlackCardWith.value = document.getElementsByClassName('displayedBlackCard')[0]?.clientWidth
    new ResizeObserver(
        () => BlackCardWith.value = document.getElementsByClassName('displayedBlackCard')[0]?.clientWidth
    ).observe(document.getElementsByClassName('displayedBlackCard')[0])
})

</script>

<style scoped>
.cardGrid{
    --multiplier: 1fr;
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr var(--multiplier) 2.5em; 
    grid-row-gap: 1ch;

}
.submit {
    --width: fit-content;
    margin: 0 auto;
    width: var(--width);
    padding: 1ch 2ch;
    text-align: center;
}
</style>