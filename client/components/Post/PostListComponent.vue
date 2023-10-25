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
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
let searchLabel = ref("");

function togglePostButton() {
  isPostToggled.value = !isPostToggled.value;
}
async function getPosts(author?: string) {
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
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <button v-if="isPostToggled" @click="togglePostButton" class="post-button" id="cancel">&#10006;</button>
    <button v-else @click="togglePostButton" class="post-button" id="create">+</button>
    <CreatePostForm v-if="isPostToggled" @refreshPosts="getPosts" />
  </section>
  <section v-else>
    <RouterLink v-slot="{ navigate }" :to="{ name: 'Login' }" style="text-decoration: none; cursor: default">
      <button class="login-button" @click="navigate">Login</button>
    </RouterLink>
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor && !searchLabel">Posts:</h2>
    <h2 v-else-if="!searchAuthor">Posts labeled as {{ searchLabel }}:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" @getPostsByLabel="getPostByLabel" />
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <Suspense>
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
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
  border-radius: 5em;
  text-align: center;
  line-height: 100px;
  cursor: pointer;
  border: none;
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
  color: black;
  border: transparent;
  border-radius: 5em;
  margin-top: 2em;
  margin-bottom: 2em;
  cursor: pointer;
}
</style>
