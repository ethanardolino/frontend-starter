<script setup lang="ts">
import ProfileViewForm from "@/components/Profile/ProfileViewForm.vue";

const props = defineProps(["username"]);
</script>

<template>
  <main class="column">
    <ProfileViewForm :username="props.username" />
  </main>
</template>
