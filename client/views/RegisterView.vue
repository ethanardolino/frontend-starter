<script setup lang="ts">
import RegisterForm from "@/components/Login/RegisterForm.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="column">
    <div class="card">
      <h1>Register below</h1>
      <RegisterForm />
      <RouterLink :to="{ name: 'Login' }">Already have an account? Log in here.</RouterLink>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Arial", sans-serif;
  margin-top: 20em;
  background-color: white;
}
.card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  background-color: #ffffff; /* Light blue background color */
  border: 1px solid #ddd; /* Light border color */
}
</style>
