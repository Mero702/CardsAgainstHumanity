<template>
    <Modal>
        <template v-slot:title>
            <h3>Winner is {{GameStore.$state.winner.name}}</h3>
        </template>
        <template v-slot:closebtn>
            <p class="colosbtn">&#xd7;</p>
        </template>
        <div class="cardPresentation heightFix">
            <Card :card="GameStore.$state.winner.black" type="BLACK"/>
            <div class="slider heightFix" @wheel="onScroll">
                <ArrowIcon :rotation="180" class="left sliderNext" :disabled="isDisabled('BACKWARD')" @click="slide('BACKWARD')"/>
                <Card v-for="(card, key) in GameStore.$state.winner.cards[index].cards" :card="card" type="WHITE" :key="key"/>
                <ArrowIcon class="sliderNext" @click="slide('FORWARD')" :disabled="isDisabled('FORWARD')"/>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
    import { useGameStore } from '@/stores/GameStore';
    import { ref } from 'vue';
    import Card from './Card.vue'
    import ArrowIcon from './icons/Arrow.vue'
    import Modal from './Modal.vue'

    const GameStore = useGameStore()
    const index = ref(0)

    function isDisabled(direction: 'FORWARD'|'BACKWARD') {
        if(direction === 'FORWARD') {
            return index.value === GameStore.$state.winner.cards.length - 1
        } else {
            return index.value === 0
        }
    }
    function slide(direction: 'FORWARD'|'BACKWARD') {
        if(direction === 'FORWARD') {
            if(GameStore.$state.winner.cards.length - 1 > index.value)
                index.value++
        }
        else {
            if(index.value > 0)
                index.value--
        }
    }
    function onScroll(event: any) {
        if(event.deltaY > 0) {
            slide('BACKWARD')
        } else if(event.deltaY < 0) {
            slide('FORWARD')
        }
    }

</script>

<style scoped>
.cardPresentation {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 1ch;
}
.slider {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    grid-column-gap: 1ch;
}
.sliderNext {
}
.slider .btn{
    transform: scale(1.5);
}
.slider .btn.left{
    transform: rotate(180deg) scale(1.5);
}
.slider .btn.disabled{
    filter: invert(.3)
}
.slider .btn:not(.disabled):hover img{
    cursor: pointer;
}
</style>