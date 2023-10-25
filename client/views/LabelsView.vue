<script setup lang="ts">
import LabelsForm from "@/components/Label/LabelsForm.vue";
</script>

<template>
  <main class="labels-container">
    <div class="card">
      <h1>Manage Labels</h1>
      <Suspense>
        <LabelsForm />
      </Suspense>
    </div>
  </main>
</template>

<style scoped>
.labels-container {
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
}
.card * {
  margin-top: 2em;
  margin-bottom: 2em;
}
</style>
