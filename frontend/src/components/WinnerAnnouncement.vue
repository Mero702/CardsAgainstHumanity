<template>
    <div class="bg" @click.self="$emit('hideAnnouncement')">
        <div class="modal display" @click.prevent @wheel="onScroll">
            <p class="closeBtn" @click="$emit('hideAnnouncement')">&#xd7;</p>
            <h3>Winner is {{GameStore.$state.winner.name}}</h3>
            <Card :text="GameStore.$state.winner.black.text" type="BLACK" :pick="GameStore.$state.winner.black.pick" class="black"/>
                <div class="slider">
                    <div class="btn left" v-bind:class="{disabled : index == 0}" @click="slide()"> <ArrowIcon /></div>
                        <div class="whiteCards" :style="countItems">
                            <Card v-for="(card, key) in GameStore.$state.winner.cards[index].cards" :key="key" :text="card.text" type="WHITE" class="white" />
                        </div>
                    <div class="btn" v-bind:class="{disabled : index == (GameStore.$state.winner.cards.length - 1)}" @click="slide(true)"><ArrowIcon /></div>
                </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useGameStore } from '@/stores/GameStore';
    import { ref } from 'vue';
    import Card from './Card.vue'
    import ArrowIcon from './icons/Arrow.vue'

    const GameStore = useGameStore()
    const index = ref(0)

    function slide(backwards: boolean = false) {
        if(!backwards) {
            if(index.value > 0)
                index.value--
        }
        else {
            if(GameStore.$state.winner.cards.length - 1 > index.value)
                index.value++
        }
    }
    function onScroll(event: any) {
        if(event.deltaY > 0) {
            slide(true)
        } else if(event.deltaY < 0) {
            slide()
        }
    }
    function countItems() {
        return {
            '--itemCount': GameStore.$state.winner.cards[index.value].cards.length || 1
        }
    }
</script>

<style scoped>
.bg {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .6);
    position: absolute;
    top: 0;
    left: 0;
}
.modal {
    height: 70vh;
    width: 80vw;
    background: #2C313A;
    z-index: 1;
    position: absolute;
    margin: auto;
    top: 0; left: 0; bottom: 0; right: 0;
    border-radius: 1em;
}
.bg:hover {
    cursor: pointer;
}
.bg > .modal:hover {
    cursor:auto;
}
.closeBtn {
    position: absolute;
    height: 2ch;
    width: 2ch;
    text-align: center;
    top: .2em;
    right: .3em;
    font-size: 1.8em;
    cursor: pointer;
}
.display {
    display: grid;
    row-gap: 1ch;
    grid-template-rows: 2em 1fr 1fr;
    justify-items: center;
    padding-bottom: 3ch;
}
.whiteCards {
    --itemCount: 1;
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(var(--itemCount), 1fr);
    justify-items: center;
}
h3 {
    padding: 1ch 0;
}
.slider {
    display: grid;
    grid-template-columns: 3em 1fr 3em;
    width: 90%;
    justify-items: center;
    align-items: center;
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