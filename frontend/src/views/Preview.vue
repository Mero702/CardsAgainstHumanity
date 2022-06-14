<template>
<div class="cardGrid">
    <Card text="test" :pick="1" type="BLACK" />
    <div class="container">
        <Cards :cards="ans"/>
    </div>
</div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import Card from '@/components/Card.vue'
import Cards from '@/components/Cards.vue'

let bc: BlackCard = {
    text: "Test",
    pick: 1
}
let cards: Selectable<Answer>[] = [
    {
        id: "1",
        cards: [
            {
                text: "A",
                order: 0
            }
        ],
        selected: false
    }, {
        id: "2",
        cards: [
            {
                text: "Test",
                order: 0
            }
        ],
        selected: false
    },
    {
        id: "2",
        cards: [
            {
                text: "RealyLong test with long wordsthat are long",
                order: 0
            }
        ],
        selected: false
    },
    {
        id: "2",
        cards: [
            {
                text: "uud owh odahwo awhdoah",
                order: 0
            }
        ],
        selected: false
    },{
        id: "2",
        cards: [
            {
                text: "Debug",
                order: 0
            }
        ],
        selected: false
    }
]
let ans: Selectable<Answer>[] = [
    {
        id: "1",
        cards: [
            {
                text: "Card1",
                order: 0
            },
            {
                text: "Card2",
                order: 1
            }
        ],
        selected: false
    },
    {
        id: "1",
        cards: [
            {
                text: "Card3",
                order: 0
            },
            {
                text: "Card4",
                order: 1
            }
        ],
        selected: false
    },
    {
        id: "1",
        cards: [
            {
                text: "Card5",
                order: 0
            },
            {
                text: "Card6",
                order: 1
            }
        ],
        selected: false
    }
]

const GameStore = useGameStore()
</script>

<style scoped>
.cardGrid{
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr 1fr; 
    grid-row-gap: .5ch;

}
.container {
    height: 100%;
    width: 100%;
    overflow: auto;
}
</style>