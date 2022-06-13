<template>
    <div class="home">
        <div class="join">
            <p>
                You can join a game by visiting the join link given to you by the room creator
            </p>
            <div class="joinId">
                <p>or via the room id</p>
                <form action="/" @submit.prevent="join">
                    <input class="val" type="text" name="room-id" id="room-id" pattern="[A-Za-z0-1]{8}" v-model="roomId" placeholder="room id" required>
                    <input class="sub" type="submit" value="join">
                </form>
            </div>
        </div>
        <div class="create">
            <p>
                Create a room <router-link to="/create">here</router-link>
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import router from '@/router/index';

    const roomId = ref('')

    function join() {
        console.log('hey: ', roomId.value);
        router.push(`/game/${roomId.value}`)
    }

</script>

<style scoped>
    .home {
        font-size: 1.4em;
        display: flex;
        flex-direction: row;
        justify-content: space-around
    }
    .home > div {
        display: flex;
        height: 100%;
    }
    .create {
        align-items: center;
    }
    .join {
        flex-direction: column;
        justify-content: center;
        align-items: left;
        gap: 2ch;
        width: 30ch;
    }
    .join > .joinId {
        text-align: left;
    }
    .joinId > form {
        padding-top: 1ch;
        display: grid;
        grid-template-columns: 4fr 1fr;
    }
    .joinId > form > * {
        box-sizing: border-box;
        border: none;
        font-size: 1em;
        padding: .5ch;
    }
    .joinId > form > .val {
        padding: .1ch .8ch;
        border-top-left-radius: .8em;
        border-bottom-left-radius: .8em;
        border-top-right-radius: none;
        border-bottom-right-radius: none;
    }
    .joinId > form > .sub{
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-top-right-radius: .8em;
        border-bottom-right-radius: .8em;
        background-color: tomato;
    }
</style>