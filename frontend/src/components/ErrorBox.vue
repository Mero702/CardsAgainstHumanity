<template>
  <dialog :open="GameStore.$state.error != ''" class="errorDialog">
    <p v-text="GameStore.$state.error"></p>
    <button @click="GameStore.$state.error = ''" ref="btn" class="acknowledgeError">
      Ok
    </button>
  </dialog>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/GameStore";
import { ref } from "vue";
const GameStore = useGameStore();

const btn = ref<HTMLElement | null>(null);
GameStore.$subscribe(() => {

  if (GameStore.$state.error != "") {
    // Timeout needed to make sure the dialog is open before the button is focused
    setTimeout(() => {
      if (btn.value) btn.value.focus();
    }, 1);
  }
});
</script>

<style scoped>
.errorDialog {
  position: absolute;
  top: 1ch;
  left: 50%;
  transform: translateX(-50%);
  padding: 2ch;
  width: 32ch;

  border-radius: 0.8em;

  background: var(--background-color-header);
  color: var(--color);
}

.errorDialog>*:not(:last-child) {
  margin-bottom: 1ch;
}

.errorDialog>button {
  position: relative;
  float: right;
  padding-left: 1ch;
  padding-right: 1ch;
  background-color: tomato;
}

.errorDialog>button:hover,
.errorDialog>button:focus,
.errorDialog>button:active {
  outline: 1px solid var(--color);
  outline-offset: 2px;
}
</style>