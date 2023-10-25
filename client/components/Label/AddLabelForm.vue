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
    <fieldset class="label-fields">
      <legend>Create a Label</legend>
      <input v-model.trim="label" type="text" id="aligned-label-1" placeholder="Label" required />
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </fieldset>
  </form>
  <form class="pure-form pure-form-aligned" @submit.prevent="addAccountLabel">
    <fieldset class="label-fields">
      <legend>Label an Account</legend>
      <input v-model.trim="username" type="text" id="username" placeholder="username" required />
      <div class="select-label-container">
        <label for="select">Label</label>
        <select class="select-label" v-model.trim="labelForAccount" name="select" required>
          <option v-for="_label in props.labels" :key="_label._id" :value="_label">{{ _label }}</option>
        </select>
      </div>
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </fieldset>
  </form>
</template>

<style scoped>
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
