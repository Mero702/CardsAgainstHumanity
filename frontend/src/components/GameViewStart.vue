<template>
  <div class="StartGame">
    <div class="center">
      <div class="shareId">
        <a @click="show = !show" href="#t">
          Click to show the room id:
          <span v-text="show ? $route.params.roomID : '•••••'"></span>
        </a>

        <p class="copy">
          copy link:
          <button @click="copyLink" title="copy link" :class="{ successful: copied }">
            <ClipBoardIcon />
          </button>
        </p>
      </div>
      <button @click="GameStore.startGame" class="bigBtn">Start game</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/GameStore";
import ClipBoardIcon from "@/components/icons/ClipBoard.vue";
import { ref } from "vue";

const show = ref(false);
const copied = ref(false);

const GameStore = useGameStore();
function copyLink() {
  if (!navigator.clipboard) {
    alert("Your browser doesn't support  feature");
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      if (copied) {
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 1500);
      }
    }); //.then( () => alert('Copied to clipboard'))
  }
}
</script>

<style>
@keyframes fallIn {
  0% {
    opacity: 0;
    transform: translateY(-40px);
  }

  20%,
  80% {
    opacity: 1;
    transform: translateY(40%);
  }

  100% {
    opacity: 0;
  }
}

.center {
  grid-row: 2;
  grid-column: 2;
}

.StartGame {
  display: grid;
  gap: 2.5ch;
  grid-template-rows: 1fr fit-content(100%) 1fr;
  grid-template-columns: 1fr fit-content(100%) 1fr;
  margin: auto 0;
  height: 100%;
}

.shareId {
  display: flex;
  grid-column: 2;
  grid-row: 2;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 2ch;
}

.shareId> :first-child {
  margin-right: 0.5ch;
}

.shareId>p {
  width: fit-content;
  height: fit-content;
  float: right;
}

.copy {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.shareId button {
  position: relative;
  display: flex;
  background-color: transparent;
  margin: 0 0.5ch;
  padding: 0;
}

.shareId button:is(.successful)::after {
  content: url("/checkMark.svg");
  width: 1.5ch;
  height: 1.5ch;
  position: absolute;
  bottom: 50%;
  transform: translateY(50%);
  right: -90%;
  animation: fallIn 1.5s ease-in-out;
}

.bigBtn {
  grid-column: 2;
  grid-row: 2;
  width: 100%;
  height: 100%;
  border-radius: 100em;
  font-size: xx-large;
}
</style>