<script setup lang="ts">
// imports
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";
import AddLabelForm from "./AddLabelForm.vue";

const _init_labels = await fetchy("/api/labels", "GET");
const labels = ref<Array<string>>(_init_labels);

async function getLabels() {
  const labelResults = await fetchy("/api/labels", "GET");
  labels.value = labelResults;
}
</script>

<template>
  <h2>Labels</h2>
  <ul>
    <li v-for="l in labels" :key="l">{{ l }}</li>
  </ul>
  <AddLabelForm v-on:refreshLabels="getLabels" v-bind:labels="labels" />
</template>
