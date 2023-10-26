<script setup lang="ts">
import { useLabelStore } from "@/stores/label";
import { ref } from "vue";

const props = defineProps(["labels"]);
const emit = defineEmits(["refreshLabels"]);
const { updateLabel } = useLabelStore();

const oldLabel = ref("");
const newLabel = ref("");

async function changeLabel() {
  await updateLabel(oldLabel.value, newLabel.value);
  emit("refreshLabels");
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="changeLabel">
    <fieldset class="label-fields">
      <legend>Change a Label</legend>
      <div class="select-label-container">
        <label for="aligned-select">Old Label</label>
        <select class="select-label" v-model.trim="oldLabel" id="aligned-select" required>
          <option v-for="_label in props.labels" :key="_label._id" :value="_label">{{ _label }}</option>
        </select>
      </div>
      <input v-model.trim="newLabel" type="text" id="aligned-label" placeholder="new label" required />
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </fieldset>
  </form>
</template>

<style scoped>
.label-fields {
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  margin-bottom: 6em;
}
.label-fields * {
  margin-top: 1.5em;
}
.select-label-container {
  display: flex;
  margin-right: 2em;
  align-items: center;
}
.select-label {
  flex: 1;
  margin-left: 2em;
}
label {
  font-size: larger;
}
</style>
