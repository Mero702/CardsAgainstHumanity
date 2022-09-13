<template>
    <div class="modal" v-if="GameStore.$state.winner.show" @click="close">
        <div class="content" @click.stop="()=>{}">
            <div class="title">
                <slot name="title">Title</slot>
                <span class="closeBtn" @click="close">
                    <slot name=closeBtn>X</slot>
                </span>
            </div>
            <slot>Error</slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/GameStore';
const GameStore = useGameStore()
function close() {
    GameStore.$state.winner.show = false;
}
</script>

<style scoped>
.modal {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: #000c;
    cursor: pointer;
}

.title {
    margin-bottom: 2.5ch;
}

.content {
    display: grid;
    z-index: 2;
    grid-template-rows: 2.5em 1fr;
    grid-row-gap: 1ch;
    height: 85%;
    width: fir-content;
    width: 80%;
    overflow: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* width: clamp(30ch, 80%, ch); */
    /* height: fit-content;clamp(30ch, 80%, 40ch); */
    background-color: var(--background-color);
    padding: 2ch;
    border-radius: .8em;
    cursor: default;
}

.closeBtn {
    position: absolute;
    top: 3ch;
    right: 3ch;
    float: right;
    cursor: pointer;
    color: var(--accentColor);
}
</style>