<template>
    <div class="msg">
        <h1>{{title[type]}}</h1>
        <p>Now you have nothing to do but wait.
            <span v-if="toggleText">Use the time to think. Think about life and your place in the universe. 
            Think of the internal combustion engine in a car and how it uses 100 explosions in a second to move people from one place to another. 
            Think about how much time you waste on pathetic, slow-thinking human beings. 
            Ask yourself when they are done and answer yourself 
            <span title="soonTM a moment between now and the heat death of the universe">soon<sup>TM</sup></span>.
            </span>
            <!-- <a @click.prevent="toggleText = !toggleText" href="">[...]</a> -->
        </p>
        <h2>Players who should be ashamed of being too slow:</h2>
        <ul v-if="Array.isArray(players)">
            <li v-for="(p, key) in players" :key="key" v-text="p"></li>
        </ul>
        <ul v-else>
            <li v-text="players"></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'WaitingMessage',
    props: ['type', 'players'],
    data() {
        return {
            title: {
                voting: 'Waiting for other players to awnser',
                finish: 'Waiting for player to choose winning card (combo)'
            },
            toggleText: true
        }
    },
}
</script>

<style scoped>
* {
    text-align: center;
    align-items: center;
}
    .msg {
        padding: .8em;
        font-size: 1.5em;
    }
    h1, h2 {
        margin-bottom: .5em;
    }
    h2 {
        margin-top: 1em;
    }
    p {
        max-width: 75ch;
        margin: 0 auto;
    }
    ul {
        list-style: none;
    }
</style>