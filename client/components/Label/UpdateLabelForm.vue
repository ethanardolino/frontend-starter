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
    <h3>Modify a Label</h3>
    <div class="pure-control-group">
      <label for="aligned-select">Old Label</label>
      <select v-model.trim="oldLabel" name="aligned-select" required>
        <option v-for="_label in props.labels" :key="_label._id" :value="_label">{{ _label }}</option>
      </select>
    </div>
    <div class="pure-control-group">
      <label for="aligned-label">New Label</label>
      <input v-model.trim="newLabel" type="text" id="aligned-label" placeholder="new label" required />
    </div>

    <div class="pure-controls">
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </div>
  </form>
</template>
