<template>
    <ul class="playerList">
        <li v-for="(player, key) in playerList" :key="key" class="player">
            <p v-text="player.name" v-bind:class="{ admin: player.master}"></p>
            <p>Score: {{player.score}}</p>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'PlayerList',
    props: ['playerList']
}
</script>

<style scoped>
/* TODO chaneg player style */
    .playerList {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    .playerList > li {
        float: left;
        padding: 1em;
    }
    .admin {
        color: rgb(155, 0, 155);
    }
    .player {
        display: flex;
        flex-direction: column;
    }
</style>