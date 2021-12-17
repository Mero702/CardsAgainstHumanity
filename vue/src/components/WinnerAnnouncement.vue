<template>
    <div class="bg" @click.self="$emit('hideAnnouncement')">
        <div class="modal display" @click.prevent>
            <p class="closeBtn" @click="$emit('hideAnnouncement')">&#xd7;</p>
            <h3>Winner is {{winner.name}}</h3>
            <Card :text="winner.black.text" type="black" :pick="winner.black.pick" class="black"/>
                <div class="slider" v-on:scroll.passive="onScroll">
                    <div class="btn left" v-bind:class="{disabled : index == 0}" @click="slide()"> <img :src="arrow" /></div>
                        <div class="whiteCards" :style="countItems">
                            <Card v-for="(card, key) in winner.cards[index].cards" :key="key" :text="card.text" type="white" class="white" />
                        </div>
                    <div class="btn" v-bind:class="{disabled : index == (winner.cards.length - 1)}" @click="slide(true)"><img :src="arrow" /></div>
                </div>
        </div>
    </div>
</template>

<script>
import Card from './Card.vue'
export default {
    name: 'WinnerAnnouncement',
    props: ['winner'],
    components: {
        Card
    },
    data() {
        return {
            index: 0,
            arrow: require('../../public/arrow.svg')
        }
    },
    methods: {
        slide: function(backwards){
            if(!backwards) {
                if(this.index > 0)
                    this.index--
            }
            else {
                if(this.winner.cards.length - 1 > this.index)
                    this.index++
            }
        },
        onscroll: function(e) {
            console.log(e)
        }
    },
    computed: {
        countItems() {
            return {
                '--itemCount': this.winner.cards[this.index].cards.length || 1
            }
        }
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
    padding-bottom: 1ch;
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
.slider .btn.left{
    transform: rotate(180deg) scale(1.5);
}
.slider .btn.disabled{
    filter: invert(.3)
}
.slider .btn:not(.disabled):hover img{
    filter: invert(1);
}
</style>