<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const label = ref("");
const emit = defineEmits(["getPostsByAuthor", "getPostsByLabel"]);

function submitAuthor() {
  label.value = "";
  emit("getPostsByAuthor", author.value);
}

function submitLabel() {
  author.value = "";
  emit("getPostsByLabel", label.value);
}
</script>

<template>
  <form @submit.prevent="submitAuthor" class="pure-form">
    <fieldset>
      <legend>Search by Author</legend>
      <input id="author" type="text" v-model="author" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
  <form @submit.prevent="submitLabel" class="pure-form">
    <fieldset>
      <legend>Search by Label</legend>
      <input id="label" type="text" v-model="label" placeholder="Label" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
