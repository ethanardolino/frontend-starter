<script setup lang="ts">
const props = defineProps(["label"]);
</script>
<template>
  <p class="label-box">{{ props.label }}</p>
</template>

<style>
.label-box {
  float: left;
  padding: 1em;
  margin: 1em;
  border: 3px solid cornflowerblue;
  border-radius: 5em;
  background-color: white;
  width: 8em;
  text-align: center;
}
</style>
