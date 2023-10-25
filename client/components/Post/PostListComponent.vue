<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const isPostToggled = ref(false);
const canUserPost = ref(true);

let posts = ref<Array<Record<string, string>>>([]);
let labelMap = ref<Map<string, string[]>>(new Map());

let editing = ref("");
let searchAuthor = ref("");
let searchLabel = ref("");

function togglePostButton() {
  isPostToggled.value = !isPostToggled.value;
}

async function getPosts(author?: string) {
  try {
    canUserPost.value = await fetchy("/api/limited_profile/numPosts", "GET");
  } catch {
    canUserPost.value = true;
  }
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

async function getLabels() {
  let labels;
  try {
    if (isLoggedIn) {
      labels = await fetchy(`/api/itemLabels`, "GET");
    }
  } catch {
    return;
  }
  let map = new Map<string, string[]>();
  for (const [user, label] of labels) {
    if (map.get(user)) map.get(user)!.push(label);
    else map.set(user, [label]);
  }
  labelMap.value = map;
}

async function getPostByLabel(label?: string) {
  await getPosts();
  let authors: string[];
  try {
    authors = await fetchy(`/api/itemLabels/items/${label}`, "GET");
  } catch {
    searchLabel.value = "";
  }
  let postResults = posts.value.filter((post) => authors.includes(post.author), []);
  if (postResults.length > 0) {
    searchLabel.value = label ? label : "";
    posts.value = postResults;
  } else {
    searchLabel.value = "";
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  await getLabels();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn" class="create-post">
    <div v-if="!canUserPost" class="over-post-limit">Come back tomorrow to post again!</div>
    <div v-else-if="isPostToggled">
      <button @click="togglePostButton" class="post-button" id="cancel">&#10006;</button>
      <CreatePostForm @refreshPosts="getPosts" />
    </div>
    <button v-else @click="togglePostButton" class="post-button" id="create">+</button>
  </section>
  <section v-else>
    <RouterLink v-slot="{ navigate }" :to="{ name: 'Login' }" style="text-decoration: none; cursor: default">
      <button class="login-button" @click="navigate">Login</button>
    </RouterLink>
  </section>
  <section>
    <SearchPostForm @getPostsByAuthor="getPosts" @getPostsByLabel="getPostByLabel" />
    <h2 v-if="!searchAuthor && !searchLabel">Posts:</h2>
    <h2 v-else-if="!searchAuthor">Posts labeled as {{ searchLabel }}:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
  </section>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <Suspense>
        <PostComponent v-if="editing !== post._id" :post="post" :labels="labelMap.get(post.author)" @refreshPosts="getPosts" @editPost="updateEditing" @refreshLabels="getLabels" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      </Suspense>
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
.post-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  width: 100%;
  height: 100px;
  border-radius: 20px;
  text-align: center;
  line-height: 100px;
  cursor: pointer;
  margin-top: 2em;
  margin-bottom: 2em;
}

#create {
  background-color: royalblue;
  font-size: 40px;
}

#cancel {
  background-color: lightcoral; /* Red color */
}

.login-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  background-color: lightgreen;
  font-size: 50px;
  font-style: italic;
  color: black;
  border-radius: 20px;
  margin-top: 2em;
  cursor: pointer;
}

.create-post {
  display: flex;
  flex-direction: column;
  justify-content: left;
}

.over-post-limit {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  margin-top: 2em;
  background-color: lightcoral;
  border-radius: 20px;
  color: black;
  font-size: 40px;
  font-weight: bold;
  font-style: italic;
}
</style>
