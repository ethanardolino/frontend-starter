<script setup lang="ts">
// imports
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import AddLabelForm from "./AddLabelForm.vue";
import DeleteLabelForm from "./DeleteLabelForm.vue";
import DisplayLabel from "./DisplayLabel.vue";
import UpdateLabelForm from "./UpdateLabelForm.vue";

const _init_labels = await fetchy("/api/labels", "GET");
const labels = ref<Array<string>>(_init_labels);

async function getLabels() {
  const labelResults = await fetchy("/api/labels", "GET");
  labels.value = labelResults;
}
</script>

<template>
  <main>
    <h2>Labels</h2>
    <div>
      <DisplayLabel v-for="l in labels" :key="l" v-bind:label="l" />
    </div>
    <div>
      <AddLabelForm v-on:refreshLabels="getLabels" v-bind:labels="labels" />
      <DeleteLabelForm v-on:refreshLabels="getLabels" v-bind:labels="labels" />
      <UpdateLabelForm v-on:refreshLabels="getLabels" v-bind:labels="labels" />
    </div>
  </main>
</template>

<style>
main {
  margin: 5em;
}
div {
  margin-top: 2em;
  margin-bottom: 2em;
  display: inline-block;
}
</style>
