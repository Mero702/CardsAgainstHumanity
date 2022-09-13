<template>
    <div class="cardGrid heightFix">
        <Card :card="GameStore.$state.cards.blackCard" type="BLACK" ref="displayedBlackCard"
            class="displayedBlackCard" />
        <div class="heightFix">
            <Cards :cards="GameStore.$state.cards.whiteCards" @toggleCard="GameStore.selectCard" />
        </div>
        <button class="submit" @click="GameStore.submitAnswer" :style="{'--width': BlackCardWith+'px'}"> Submit
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import Card from '@/components/Card.vue'
import Cards from '@/components/Cards.vue'
import { ref, onMounted } from 'vue';

const GameStore = useGameStore()

const BlackCardWith = ref(0)

onMounted(() => {
    BlackCardWith.value = document.getElementsByClassName('displayedBlackCard')[0]?.clientWidth
    new ResizeObserver(
        () => BlackCardWith.value = document.getElementsByClassName('displayedBlackCard')[0]?.clientWidth
    ).observe(document.getElementsByClassName('displayedBlackCard')[0])
})

</script>

<style scoped>
.cardGrid {
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr 1fr auto;
    grid-row-gap: 1ch;

}

.submit {
    --width: fit-content;
    margin: .25ch auto;
    width: var(--width);
    padding: 1ch 2ch;
    text-align: center;
}
</style>