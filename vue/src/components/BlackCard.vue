<template>
    <div class="card">
        <p v-text="card.text"></p>
        <p>Pick: {{card.pick}}</p>
    </div>
</template>

<script>
export default {
    name: 'BlackCard',
    props: ['card']
}
</script>

<style scoped>
.card {
    background: black;
    color: whitesmoke;
    width: 12em;
    height: 7em;
    margin: 0 .5em;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
</style>