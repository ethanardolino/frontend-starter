<script setup lang="ts">
// imports
import { useLabelStore } from "@/stores/label";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import AddLabelForm from "./AddLabelForm.vue";
import DisplayLabel from "./DisplayLabel.vue";
import UpdateLabelForm from "./UpdateLabelForm.vue";

const { removeLabel } = useLabelStore();
const _init_labels = await fetchy("/api/itemLabels/labels", "GET");
const labels = ref<Array<string>>(_init_labels);
const item = ref("");

async function getLabels() {
  const labelResults = await fetchy(`/api/itemLabels/labels/${item.value}`, "GET");
  labels.value = labelResults;
}

async function deleteLabels(label: string) {
  await removeLabel(label, item.value);
  await getLabels();
}
</script>

<template>
  <main>
    <form class="pure-form" @submit.prevent="getLabels">
      <fieldset class="label-fields">
        <legend>Find every Label associated with an Account</legend>
        <input type="text" v-model="item" placeholder="username" />
        <button type="submit" class="pure-button pure-button-primary">Find Labels</button>
      </fieldset>
    </form>
    <div class="group">
      <DisplayLabel v-for="l in labels" :key="l" v-bind:label="l" v-on:deleteLabel="deleteLabels" />
    </div>
    <section>
      <AddLabelForm v-on:refreshLabels="getLabels" v-bind:labels="labels" />
    </section>
    <section>
      <UpdateLabelForm v-on:refreshLabels="getLabels" v-bind:labels="labels" />
    </section>
  </main>
</template>

<style>
main {
  margin: 5em;
}
.group {
  margin-top: 2em;
  margin-bottom: 2em;
  display: flex;
  flex-wrap: wrap;
}
section {
  margin-top: 2em;
  margin-bottom: 2em;
  display: flex;
  flex-direction: column;
}

legend {
  font-size: x-large;
  font-style: italic;
  font-weight: bolder;
}

.label-fields {
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  margin-bottom: 6em;
}
.label-fields * {
  margin-top: 1.5em;
}
</style>
