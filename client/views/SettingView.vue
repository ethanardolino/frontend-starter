<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="settings-container">
    <div class="card">
      <h1>Manage Settings</h1>
      <UpdateUserForm />
      <menu class="meta-functions">
        <button class="pure-button pure-button-primary" @click="logout">Logout</button>
        <button class="button-error pure-button" @click="delete_">Delete User</button>
      </menu>
    </div>
  </main>
</template>

<style scoped>
.settings-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Arial", sans-serif;
  margin-top: 10em;
  background-color: white;
}
.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* Light blue background color */
  border: 1px solid #ddd; /* Light border color */
  width: 70%;
}
.card * {
  margin-top: 2em;
  margin-bottom: 2em;
}
.meta-functions {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}
</style>
