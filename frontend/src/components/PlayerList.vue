<template>
    <ul class="playerList">
        <li v-for="(player, key) in playerList" :key="key" class="player">
            <p v-text="player.name" v-bind:class="{ admin: player.isMaster}"></p>
            <p>Score: {{player.score}}</p>
            <p v-text="(player.finished) ? '&#10003;' : '&#10006;' "></p>
        </li>
    </ul>
</template>

<script lang="ts" setup>
const props = defineProps<{
    playerList: PlayerInfo[]
}>()
</script>

<style scoped>
.playerList {
    list-style-type: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.playerList>li {
    float: left;
    padding: 1em;
}

.admin {
    color: var(--accent-color);
}

.player {
    display: flex;
    flex-direction: column;
}
</style>