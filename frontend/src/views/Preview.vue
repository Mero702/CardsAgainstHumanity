<template>
    <div class="cardGrid" :style="{'--multiplier' : cardCount()}">
        <Card :card="bc" type="BLACK" ref="displayedBlackCard" class="displayedBlackCard"/>
        <div class="container">
            <Cards :cards="ans" @toggleCard="(key) => updateSelection(key)"/>
        </div>
        <button class="submit" @click="$emit('submitAnswer')" :style="{'--width': BlackCardWith+'px'}"> Submit </button>
    </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import Card from '@/components/Card.vue'
import Cards from '@/components/Cards.vue'
import { ref, onMounted } from 'vue';

const BlackCardWith = ref(0)
function updateSelection(key: string) {
    let index = ans.value.findIndex(x => x.id == key)
    ans.value[index].selected = !ans.value[index].selected
}
function cardCount() {
    return (ans.value[0].cards.length + 'fr') || '1fr';
}
onMounted(() => {
    BlackCardWith.value = document.getElementsByClassName('displayedBlackCard')[0]?.clientWidth
    new ResizeObserver(
        () => BlackCardWith.value = document.getElementsByClassName('displayedBlackCard')[0]?.clientWidth
    ).observe(document.getElementsByClassName('displayedBlackCard')[0])
})

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
const ans = ref<Selectable<Answer>[]>([
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
        id: "2",
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
        selected: true
    },
    {
        id: "3",
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
])

const GameStore = useGameStore()
</script>

<style scoped>
.cardGrid{
    --multiplier: 1fr;
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr var(--multiplier) 2.5em; 
    grid-row-gap: 1ch;

}
.container {
    height: 100%;
    width: 100%;
    overflow: auto;
}
.submit {
    --width: fit-content;
    margin: 0 auto;
    width: var(--width);
    padding: 1ch 2ch;
    text-align: center;
}
</style>