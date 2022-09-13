<template>
    <Modal>
        <template v-slot:title>
            <h3>Winner is {{GameStore.$state.winner.name}}</h3>
        </template>
        <template v-slot:closeBtn>
            <p class="closeBtn">&#xd7;</p>
        </template>
        <!-- TODO: change this to one grid with slider elements -->
        <div class="cardPresentation heightFix">
            <Card :card="GameStore.$state.winner.black" type="BLACK" />
            <Slider :min="0" :max="GameStore.$state.winner.cards.length - 1" @change="(newIndex) => index = newIndex">
                <div class="cardStack heightFix">
                    <Card v-for="card in GameStore.$state.winner.cards[index.valueOf()].cards" :card="card"
                        type="WHITE"></Card>
                </div>
            </Slider>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import { ref } from 'vue';
import Card from './Card.vue'
import Slider from './Slider.vue'
import Modal from './Modal.vue'

const GameStore = useGameStore()
const index = ref<Number>(0)



</script>

<style scoped>
.cardPresentation {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 1ch;
}

.cardStack {
    display: grid;
    grid-column-gap: 1ch;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
</style>