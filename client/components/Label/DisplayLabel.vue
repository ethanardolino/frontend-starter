<script setup lang="ts">
const props = defineProps(["label"]);
const emit = defineEmits(["deleteLabel"]);
</script>
<template>
  <div class="label-box">
    <p class="label-text">{{ props.label }}</p>
    <button class="delete" @click="emit('deleteLabel', props.label)">X</button>
  </div>
</template>

<style>
.label-box {
  display: flex;
  float: left;
  margin: 1em;
  border: 3px solid cornflowerblue;
  border-radius: 5em;
  background-color: white;
  width: 12em;
  align-content: center;
  justify-content: center;
}
.label-text {
  float: left;
  font-size: larger;
}
.delete {
  float: left;
  margin: 1em;
  background-color: red;
  border-color: transparent;
}
.delete:hover {
  background-color: lightcoral;
  transition: 0.2s;
}
</style>
