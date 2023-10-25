<script setup lang="ts">
import { useLabelStore } from "@/stores/label";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import DisplayLabel from "../Label/DisplayLabel.vue";

const { removeLabel } = useLabelStore();
const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const labels = ref([]);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

async function getLabels() {
  try {
    if (isLoggedIn) {
      labels.value = await fetchy(`/api/itemLabels/labels/${props.post.author}`, "GET");
    }
  } catch {
    return;
  }
}

async function deleteLabels(label: string) {
  await removeLabel(label, props.post.author);
}
onMounted(async () => {
  await getLabels();
});
</script>

<template>
  <div class="group">
    <DisplayLabel v-for="l in labels" :key="l" v-bind:label="l" v-on:deleteLabel="deleteLabels" />
  </div>
  <p class="author">{{ props.post.author }}</p>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
