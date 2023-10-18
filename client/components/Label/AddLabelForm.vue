<script setup lang="ts">
import { ref } from "vue";
import { useLabelStore } from "../../stores/label";

const props = defineProps(["labels"]);
const label = ref("");
const username = ref("");
const labelForAccount = ref("");
const emit = defineEmits(["refreshLabels", "refreshItemLabels"]);
const { createLabel, labelAccount } = useLabelStore();

async function addLabel() {
  await createLabel(label.value);
  emit("refreshLabels");
}

async function addAccountLabel() {
  await labelAccount(labelForAccount.value, username.value);
  emit("refreshItemLabels");
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="addLabel">
    <h3>Create a label</h3>
    <div class="pure-control-group">
      <label for="aligned-label-1">Label</label>
      <input v-model.trim="label" type="text" id="aligned-label-1" placeholder="Label" required />
    </div>
    <div class="pure-controls">
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </div>
  </form>
  <form class="pure-form pure-form-aligned" @submit.prevent="addAccountLabel">
    <h3>Label an Account</h3>
    <div class="pure-control-group">
      <label for="aligned-username">Username</label>
      <input v-model.trim="username" type="text" id="aligned-username" placeholder="User to Label" required />
    </div>
    <div class="pure-control-group">
      <label for="aligned-select">Label</label>
      <select v-model.trim="labelForAccount" name="aligned-select" required>
        <option v-for="_label in props.labels" :key="_label._id" :value="_label">{{ _label }}</option>
      </select>
    </div>
    <div class="pure-controls">
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </div>
  </form>
</template>
