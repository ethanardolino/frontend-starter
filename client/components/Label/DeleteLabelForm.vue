<script setup lang="ts">
import { useLabelStore } from "@/stores/label";
import { ref } from "vue";

const props = defineProps(["labels"]);
const emit = defineEmits(["refreshLabels"]);
const { removeLabel } = useLabelStore();

const label = ref("");

async function deleteLabel() {
  await removeLabel(label.value, "");
  emit("refreshLabels");
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="deleteLabel">
    <h3>Delete a Label</h3>
    <div class="pure-control-group">
      <label for="aligned-select">Label</label>
      <select v-model.trim="label" name="aligned-select" required>
        <option v-for="_label in props.labels" :key="_label._id" :value="_label">{{ _label }}</option>
      </select>
    </div>
    <div class="pure-controls">
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </div>
  </form>
</template>
