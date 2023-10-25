<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let password = ref("");
let handle = ref("");

const { updateUser, updateHandle, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}
</script>

<template>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset class="settings-fields">
      <legend>Change your username</legend>
      <input type="text" placeholder="New username" v-model="username" required />
      <button type="submit" class="pure-button pure-button-primary">Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form pure-form-aligned">
    <fieldset class="settings-fields">
      <legend>Change your password</legend>
      <input type="password" placeholder="New password" v-model="password" required />
      <button type="submit" class="pure-button pure-button-primary">Update password</button>
    </fieldset>
  </form>
  <form @submit.prevent="updateHandle(handle)" class="pure-form pure-form-aligned">
    <fieldset class="settings-fields">
      <legend>Change your handle</legend>
      <input type="text" placeholder="New handle" v-model="handle" required />
      <button type="submit" class="pure-button pure-button-primary">Update handle</button>
    </fieldset>
  </form>
</template>

<style scoped>
legend {
  font-size: x-large;
  font-style: italic;
  font-weight: bolder;
}

.settings-fields {
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  margin-bottom: 6em;
}
.settings-fields * {
  margin-top: 1.5em;
}
</style>
