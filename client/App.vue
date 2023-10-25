<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import DailyUsageForm from "./components/Profile/DailyUsageForm.vue";
const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <div id="sidebar-toggle" @click="toggleSidebar">&#9776;</div>
    <RouterLink class="title" :to="{ name: 'Home' }">Ounce</RouterLink>
    <DailyUsageForm v-if="isLoggedIn" />
  </header>

  <div id="sidebar-container" :style="{ left: isSidebarOpen ? '0' : '-250px' }">
    <aside id="sidebar">
      <RouterLink :class="{ notUnderline: currentRouteName == 'Home' }" :to="{ name: 'Home' }"> Home </RouterLink>
      <RouterLink v-if="isLoggedIn" :class="{ notUnderline: currentRouteName == 'Settings' }" :to="{ name: 'Settings' }"> Settings </RouterLink>
      <RouterLink v-if="isLoggedIn" :class="{ notUnderline: currentRouteName == 'Labels' }" :to="{ name: 'Labels' }"> Labels </RouterLink>
      <RouterLink v-else :class="{ notUnderline: currentRouteName == 'Login' }" :to="{ name: 'Login' }"> Login </RouterLink>
    </aside>
  </div>
  <article v-if="toast !== null" class="toast" :class="toast.style">
    <p>{{ toast.message }}</p>
  </article>
  <RouterView :class="{ 'content-with-sidebar': isSidebarOpen === true }" />
</template>

<style>
header {
  display: flex;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: space-between;
  background-color: lightblue;
  color: #fff;
}
.notUnderline {
  text-decoration: none !important;
}
.title {
  flex-grow: 1;
  font-weight: bold;
  font-family: "Brush Script MT", cursive;
  font-size: 5em;
  padding: 0%;
  color: black;
  text-decoration: none;
}

#sidebar-toggle {
  padding: 2em;
  font-size: 1.5em;
  cursor: pointer;
  color: black;
}

main {
  padding: 20px;
}

/* Add additional styles for your sidebar if needed */
#sidebar-container {
  position: fixed;
  top: 122.5px; /* Adjust as needed based on your header height */
  left: -250px;
  width: 245px;
  height: 100vh;
  background-color: #f2f2f2;
  transition: left 0.3s ease;
  border: black solid 2px;
}

#sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: black; /* Adjust text color as needed */
  align-items: center;
}
#sidebar * {
  margin-bottom: 30px;
  color: black;
  font-size: x-large;
}

/* Style for the content when the sidebar is open */
.content-with-sidebar {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}
</style>
