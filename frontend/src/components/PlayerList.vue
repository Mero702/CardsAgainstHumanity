<template>
    <ul class="playerList">
        <li v-for="(player, key) in playerList" :key="key" class="player">
            <p v-text="player.name" v-bind:class="{ admin: player.isMaster}"></p>
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
    .playerList {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .playerList > li {
        float: left;
        padding: 1em;
    }
    .admin {
        color: tomato;
    }
    .player {
        display: flex;
        flex-direction: column;
    }
</style>