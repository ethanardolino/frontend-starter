<script setup lang="ts">
import { useLabelStore } from "@/stores/label";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeUpdate, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import DisplayLabel from "../Label/DisplayLabel.vue";
import PostComponent from "../Post/PostComponent.vue";

const props = defineProps(["username"]);
const { currentUsername } = storeToRefs(useUserStore());
const { removeLabel, labelAccount } = useLabelStore();
const loaded = ref(false);
const all_labels = ref<string[]>([]);
const profile_labels = ref<string[]>([]);
const addedLabel = ref("");

let posts = ref<Array<Record<string, string>>>([]);
let numFollowers = ref<number>();
let handle = ref<number>();
let canEdit = ref<boolean>();

async function getPostsByProfile() {
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query: { author: props.username } });
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

async function getNumFollowers() {
  let count: number;
  try {
    count = await fetchy(`/api/profiles/num_followers/${props.username}`, "GET");
  } catch {
    return;
  }
  numFollowers.value = count;
}

async function getHandle() {
  let _handle;
  try {
    _handle = await fetchy(`/api/profiles/handle/${props.username}`, "GET");
  } catch {
    return;
  }
  handle.value = _handle;
}

async function follow() {
  await fetchy(`/api/profiles/following/${props.username}`, "POST");
  await getLabels();
}

async function unfollow() {
  await fetchy(`/api/profiles/following/${props.username}`, "DELETE");
  await getLabels();
}
async function getLabels() {
  profile_labels.value = await fetchy(`/api/itemLabels/labels/${props.username}`, "GET");
}

async function deleteLabels(label: string) {
  await removeLabel(label, props.username);
  await getLabels();
}

async function addLabel() {
  if (!profile_labels.value.includes(addedLabel.value)) {
    try {
      await labelAccount(addedLabel.value, props.username);
      await getLabels();
    } catch {
      addedLabel.value = "";
    }
  }
  addedLabel.value = "";
}

async function hookHelper() {
  await getNumFollowers();
  await getHandle();
  await getPostsByProfile();
  canEdit.value = currentUsername.value === props.username;
  loaded.value = true;
}

onMounted(async () => {
  await hookHelper();
  all_labels.value = (await fetchy("/api/itemLabels/labels", "GET")).filter((label: string) => label !== "Following");
  await getLabels();
});
onBeforeUpdate(hookHelper);
</script>

<template>
  <div v-if="loaded" class="column">
    <div class="profile-box">
      <p class="account-name">@{{ props.username }}</p>
      <div class="followers-box">
        <p class="kinda-important-text">Followers</p>
        <p class="bottom-text">{{ numFollowers }}</p>
      </div>
    </div>
    <p class="kinda-important-text" style="margin-top: 2em">"{{ handle }}"</p>
    <RouterLink v-if="canEdit" v-slot="{ navigate }" :to="{ name: 'Settings' }" style="text-decoration: none; cursor: default">
      <button class="settings-button" @click="navigate">Manage Settings</button>
    </RouterLink>
    <div v-else class="not-user-container">
      <div class="follow-container">
        <button class="follow-button" @click="follow" style="background-color: lightgreen">Follow</button>
        <button class="follow-button" @click="unfollow" style="background-color: lightcoral">Unfollow</button>
      </div>
      <div class="column">
        <p class="kinda-important-text" style="margin-top: 4em">Modify Labels</p>
        <div class="label-container">
          <label for="select-label-el" class="big-label">+</label>
          <select class="add-label" v-model.trim="addedLabel" name="select-label-el" @change="addLabel" required>
            <option v-for="l in all_labels" :key="l" :value="l">{{ l }}</option>
          </select>
          <DisplayLabel v-for="l in profile_labels" :key="l" v-bind:label="l" v-on:deleteLabel="deleteLabels" />
        </div>
      </div>
    </div>
  </div>
  <header v-else>Loading Profile...</header>
  <section v-if="loaded && posts.length !== 0">
    <article class="post-box" v-for="post in posts" :key="post._id" style="margin-top: 1em">
      <PostComponent :post="post" @refreshPosts="getPostsByProfile" />
    </article>
  </section>
  <h3 v-else-if="loaded">No posts.</h3>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}

.post-box {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  margin: 4em;
}
.profile-box {
  margin-top: 5em;
  display: flex;
  justify-content: space-around;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* Light blue background color */
  border: 1px solid #ddd; /* Light border color */
}

.account-name {
  font-weight: bold;
  font-size: 40px;
  font-family: "Comic Sans MS";
  font-style: italic;
  padding: 0%;
  color: black;
}

.followers-box {
  width: 200px;
  text-align: center;
  line-height: 0.1;
  margin-left: 3em;
  margin-right: 3em;
}

.kinda-important-text {
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

.settings-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: lightblue;
  font-size: 20px;
  font-style: italic;
  color: black;
  border-radius: 20px;
  cursor: pointer;
}
.not-user-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.follow-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.follow-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10em;
  height: 60px;
  font-size: 20px;
  font-style: italic;
  color: black;
  border-radius: 20px;
  cursor: pointer;
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
