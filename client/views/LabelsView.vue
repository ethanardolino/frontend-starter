<script setup lang="ts">
import LabelsForm from "@/components/Label/LabelsForm.vue";
</script>

<template>
  <main>
    <h2>Manage Labels</h2>
    <Suspense>
      <LabelsForm />
    </Suspense>
  </main>
</template>
