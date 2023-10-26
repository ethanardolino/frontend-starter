<script setup lang="ts">
import { useLabelStore } from "@/stores/label";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { fetchy } from "../../utils/fetchy";
import DisplayLabel from "../Label/DisplayLabel.vue";

const { removeLabel, labelAccount } = useLabelStore();
const props = defineProps(["post", "labels", "canAddLabel"]);
const emit = defineEmits(["editPost", "refreshPosts", "refreshLabels"]);
const { currentUsername } = storeToRefs(useUserStore());
const all_labels = ref<Array<string>>([]);
const addedLabel = ref("");

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

async function deleteLabels(label: string) {
  await removeLabel(label, props.post.author);
  emit("refreshLabels");
  emit("refreshPosts");
}

async function addLabel() {
  try {
    await labelAccount(addedLabel.value, props.post.author);
  } catch {
    addedLabel.value = "";
  }
  emit("refreshLabels");
  addedLabel.value = "";
  emit("refreshPosts");
}

onMounted(async () => {
  all_labels.value = await fetchy("/api/itemLabels/labels", "GET");
});
</script>

<template>
  <div class="label-container">
    <div v-if="props.canAddLabel">
      <label :for="props.post._id" class="big-label">+</label>
      <select class="add-label" v-model.trim="addedLabel" :id="props.post._id" @change="addLabel" required>
        <option v-for="l in all_labels" :key="l" :value="l">{{ l }}</option>
      </select>
    </div>
    <DisplayLabel v-for="l in labels" :key="l" v-bind:label="l" v-on:deleteLabel="deleteLabels" />
  </div>
  <RouterLink v-slot="{ navigate }" :to="{ name: 'Profile', params: { username: props.post.author } }">
    <button class="author" @click="navigate">{{ props.post.author }}</button>
  </RouterLink>
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

.add-label {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 4em;
  height: 4em;
  padding: 10px;
  border: 3px solid green;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;
  outline: none;
  background-color: white;
}
.big-label {
  font-size: 2em;
  font-weight: bolder;
  margin-right: 5px;
}

.label-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
