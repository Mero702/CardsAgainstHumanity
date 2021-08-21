<template>
    <div class="bg" @click="$parent.winner.show = false">
        <div class="modal">
            <h1>lol</h1>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WinnerAnnouncement',
    props: ['blackCard', 'WhiteCards']
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
</style>