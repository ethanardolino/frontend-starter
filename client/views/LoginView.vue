<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="login-container">
    <div class="card">
      <h1>Login Below</h1>
      <LoginForm />
      <RouterLink :to="{ name: 'Register' }">Don't have an account? Register now.</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.login-container {
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* Light blue background color */
  border: 1px solid #ddd; /* Light border color */
}
</style>
