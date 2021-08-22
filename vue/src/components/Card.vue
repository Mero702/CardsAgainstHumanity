<template>
    <div v-bind:class="{white: type == 'white', black: type == 'black', isSelected: isSelected}" class="card">
        <p v-text="text" class="text"></p>
        <p v-text="'pick: '+pick" class="pick" v-if="pick"></p>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: ['text', 'type', 'pick', 'isSelected']
}
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    --scale: 1.3;
    width: calc(var(--scale)*6.3em);
    height: calc(var(--scale)*8.8em);
    padding: .4em;
    border-radius: .8em;
    overflow: scroll;
    justify-content: space-between;
    text-align: center;
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