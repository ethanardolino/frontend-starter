<script setup lang="ts">
import router from "@/router";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import DailyUsageForm from "./components/Profile/DailyUsageForm.vue";
import { fetchy } from "./utils/fetchy";

const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, currentUsername } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

async function logout() {
  await userStore.logoutUser();
  void router.push({ name: "Home" });
}

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

// removes post restriction for user's everyday
onMounted(async () => {
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
      await fetchy("/api/limited_profile", "DELETE");
    }
  }, 1000);
});
</script>

<template>
  <header>
    <div id="sidebar-toggle" @click="toggleSidebar">&#9776;</div>
    <RouterLink class="title" :to="{ name: 'Home' }" :style="{ 'flex-grow': isLoggedIn ? 0 : 1 }">Ounce</RouterLink>
    <div class="user-box" v-if="isLoggedIn">
      <p class="top-text">user:</p>
      <p class="bottom-text">@{{ currentUsername }}</p>
    </div>
    <DailyUsageForm v-if="isLoggedIn" />
    <button v-if="isLoggedIn" class="logout-button" @click="logout">Logout</button>
  </header>

  <div id="sidebar-container" :style="{ left: isSidebarOpen ? '0' : '-250px' }">
    <aside id="sidebar">
      <RouterLink :class="{ notUnderline: currentRouteName == 'Home' }" :to="{ name: 'Home' }"> Home </RouterLink>
      <div class="column" v-if="isLoggedIn">
        <RouterLink v-if="isLoggedIn" :class="{ notUnderline: currentRouteName == 'Settings' }" :to="{ name: 'Settings' }"> Settings </RouterLink>
        <RouterLink v-if="isLoggedIn" :class="{ notUnderline: currentRouteName == 'Labels' }" :to="{ name: 'Labels' }"> Labels </RouterLink>
        <RouterLink v-if="isLoggedIn" :class="{ notUnderline: currentRouteName == 'Profiles' }" :to="{ name: 'Profile', params: { username: currentUsername } }"> Profile </RouterLink>
      </div>
      <RouterLink v-else :class="{ notUnderline: currentRouteName == 'Login' }" :to="{ name: 'Login' }"> Login </RouterLink>
    </aside>
  </div>
  <article v-if="toast !== null" class="toast" :class="toast.style">
    <p>{{ toast.message }}</p>
  </article>
  <RouterView :class="{ 'content-with-sidebar': isSidebarOpen === true }" />
</template>

<style scoped>
@import "./assets/toast.css";
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
  font-weight: bold;
  font-family: "Brush Script MT", cursive;
  font-size: 5em;
  padding: 0%;
  color: black;
  text-decoration: none;
}

#sidebar-toggle {
  padding-left: 1em;
  padding-right: 1em;
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

.user-box {
  width: 200px;
  text-align: center;
  line-height: 0.1;
  margin-left: 3em;
  margin-right: 3em;
}

.top-text {
  font-weight: bold;
  font-size: 24px;
  font-family: "Comic Sans MS";
  font-style: italic;
  padding: 0%;
  color: black;
}

.bottom-text {
  font-weight: bold;
  font-size: 3em;
  font-family: "Comic Sans MS";
  padding: 0%;
  color: black;
}

.logout-button {
  margin-right: 1em;
  background-color: lightcoral;
  border-radius: 3px;
  font-size: 2em;
  padding: 10px;
  font-style: italic;
}
</style>
