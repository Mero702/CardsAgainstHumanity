<template>
    <div class="home">
        <div>
            <p>
                You can join a game by visiting the join link given to you by the room creator
            </p>
        </div>
        <div>
            <p>
                Create a room <router-link to="/create">here</router-link>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    
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
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .home > div > p {
        width: 24ch;
    }
</style>