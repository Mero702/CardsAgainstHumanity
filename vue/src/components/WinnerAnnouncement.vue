<template>
    <div class="bg" @click.self="$emit('hideAnnouncement')">
        <div class="modal display" @click.prevent>
            <p class="closeBtn" @click="$emit('hideAnnouncement')">&#xd7;</p>
            <h3>Winner is {{winner.name}}</h3>
            <Card :text="winner.black.text" type="black" :pick="winner.black.pick" class="black"/>
            <div class="whiteCards" :style="countItems" v-bind:class="{ first: index == 0, last: index == (winner.cards.length - 1)}">
                <Card v-for="(card, key) in winner.cards[index].cards" :key="key" :text="card.text" type="white" class="white" />
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
            index: 0
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
}
.display > *, .whiteCards > * {
    margin: 0 auto;
}
.whiteCards {
    --itemCount: 1;
    display: grid;
    width: 100%;
    grid-template-columns: repeat(var(--itemCount), 1fr);
    margin-bottom: 1ch;
}
h3 {
    padding: 1ch 0;
}
</style>