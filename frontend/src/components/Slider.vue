<template>
    <div class="slider heightFix" @wheel="onScroll">
        <ArrowIcon :rotation="180" class="left sliderNext" :disabled="isDisabled('BACKWARD')"
            @click="slide('BACKWARD')" />
        <slot>
            No Element {{index}}
        </slot>
        <ArrowIcon class="sliderNext" @click="slide('FORWARD')" :disabled="isDisabled('FORWARD')" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ArrowIcon from './icons/Arrow.vue'

const props = defineProps<{
    min: Number,
    max: Number
}>()
const emits = defineEmits<{
    (e: 'change', newValue: Number): void
}>()
const index = ref(0)

function isDisabled(direction: 'FORWARD' | 'BACKWARD') {
    if (direction === 'FORWARD') {
        return !(index.value < props.max)
    } else {
        return !(index.value > props.min)
    }
}
function setValue(newValue: number) {
    index.value = newValue
    emits('change', index.value);

}
function slide(direction: 'FORWARD' | 'BACKWARD') {
    if (direction === 'FORWARD') {
        if (!isDisabled('FORWARD'))
            setValue(index.value + 1)
    } else {
        if (!isDisabled('BACKWARD'))
            setValue(index.value - 1)
    }
    console.log(index.value);

}
// TODO: pointer events
let debounce = false
function onScroll(event: any) {
    if (debounce) return
    debounce = true
    if (event.deltaY < 0 || event.deltaX < 0) {
        slide('BACKWARD')
    } else if (event.deltaY > 0 || event.deltaX > 0) {
        slide('FORWARD')
    }
    setTimeout(() => {
        debounce = false
    }, 400)
}

</script>

<style scoped>
.cardPresentation {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 1ch;
}

.slider {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    grid-column-gap: 1ch;
}

.slider .btn {
    transform: scale(1.5);
}

.slider .btn.left {
    transform: rotate(180deg) scale(1.5);
}

.slider .btn.disabled {
    filter: invert(.3)
}

.slider .btn:not(.disabled):hover img {
    cursor: pointer;
}
</style>