<template>
    <svg class="arrow" :class="{'disabled': disabled}" :style="{'--color': color, '--rotation': rotation}" xmlns="http://www.w3.org/2000/svg" viewBox="6.03 0 11.94 24"><path fill="tomato" d="M6.028 0v6.425l5.549 5.575-5.549 5.575v6.425l11.944-12z"></path></svg>
</template>
<script setup lang="ts">
    import { defineProps } from 'vue';
    const props = defineProps<
        {
            color?: string,
            rotation?: number,
            disabled?: boolean
        }
    >()
</script>

<style scoped>
.arrow {
    --rotation: 0;
    --color: tomato;
    fill: var(--color);
    transform: rotate(calc(1deg*var(--rotation)));
    aspect-ratio: 5.91 / 24px;
    height: 2em;
}
.arrow.disabled {
    filter: opacity(0.4);
}
</style>