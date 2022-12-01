<template>
    <ul class="playerList">
        <li v-for="(player, key) in GameStore.$state.game.playerList" :key="key" class="player">
            <p v-text="player.name" v-bind:class="{ admin: player.isHost }"></p>
            <p>Score: {{ player.score }}</p>
            <p v-if="player.finished">&#10003;</p>
            <p v-else>&#10006;</p>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';

const GameStore = useGameStore();
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