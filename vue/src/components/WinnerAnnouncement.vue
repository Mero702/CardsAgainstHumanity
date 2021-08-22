<template>
    <div class="bg" @click.self="$emit('hideAnnouncement')">
        <div class="modal display" @click.prevent>
            <p class="closeBtn" @click="$emit('hideAnnouncement')">&#xd7;</p>
            <p>Pick from {{winner.name}}</p>
            <Card :text="winner.black.text" type="black" :pick="winner.black.pick" class="black"/>
            <div class="whiteCards">
                <Card v-for="(card, key) in winner.white" :key="key" :text="card.text" type="white" class="white" />
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
    height: 35em;
    width: 55em;
    background: #2C313A;
    z-index: 1;
    position: absolute;
    margin: auto;
    top: 0; left: 0; bottom: 0; right: 0;
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
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.whiteCards {
    display: flex;
    flex-direction: row;
}
.white {
    margin: 0 .5em
}
</style>