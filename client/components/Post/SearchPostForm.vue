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
  <main class="card">
    <h1>Filter by ...</h1>
    <div class="search-container">
      <form @submit.prevent="submitAuthor" class="pure-form">
        <fieldset class="search-fields">
          <legend>Author</legend>
          <input id="author" type="text" v-model="author" placeholder="Username" />
          <button type="submit" class="pure-button pure-button-primary">Search</button>
        </fieldset>
      </form>
      <form @submit.prevent="submitLabel" class="pure-form">
        <fieldset class="search-fields">
          <legend>Label</legend>
          <input id="label" type="text" v-model="label" placeholder="Label" />
          <button type="submit" class="pure-button pure-button-primary">Search</button>
        </fieldset>
      </form>
    </div>
  </main>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* Light blue background color */
  border: 1px solid #ddd; /* Light border color */
}
.search-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-top: 4em;
  margin-bottom: 2em;
  width: 100%;
}
legend {
  font-size: x-large;
  font-style: italic;
  font-weight: bolder;
}
.search-fields {
  display: flex;
  flex-direction: column;
}
.search-fields * {
  margin-top: 1.5em;
}
form {
  display: flex;

  align-items: center;
}
</style>
