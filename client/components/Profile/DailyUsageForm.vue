<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());
const usage = ref<number>(0);
const intervalID = ref<NodeJS.Timeout>();

function calculateTime() {
  const timeStr = (t: number) => (String(t).length == 1 ? `0${t}` : t);
  const time = usage.value;
  const hours = timeStr(Math.floor(time / 3600));
  const minutes = timeStr(Math.floor((time % 3600) / 60));
  const seconds = timeStr(Math.floor(time % 60));
  return `${hours}:${minutes}:${seconds}`;
}
onMounted(async () => {
  intervalID.value = setInterval(async () => {
    if (isLoggedIn) {
      usage.value = (await fetchy("/api/profiles/timeActive", "GET")).seconds;
    }
  }, 1000);
});

onUnmounted(async () => {
  clearInterval(intervalID.value);
});
</script>
<template>
  <body class="clock">
    <div class="clock-container">
      <span class="clock-label">Daily Usage</span>
      <div class="clock-divider"></div>
      <span class="clock-value">{{ calculateTime() }}</span>
    </div>
  </body>
</template>

<style>
.clock {
  display: flex;
  justify-content: flex-end;
}
.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 6px solid black;
  border-radius: 1em;
  background-color: lightgray;
  width: fit-content;
  color: black;
}
.clock-value {
  font-size: 2em;
  padding: 5px;
}
.clock-label {
  font-size: 1.5em;
}
.clock-divider {
  width: 100%;
  border-top: 4px solid black;
  margin: 5px 0;
}
</style>
