import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Label, LimitedPost, LimitedProfile, Post, Profile, User, WebSession } from "./app";
import { NotAllowedError } from "./concepts/errors";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/profiles/timeActive")
  async getUsage(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const usage_seconds = (await Profile.getTimeActive(user)) + WebSession.getSessionTime(session);
    return Profile.getReadableTimeActive(usage_seconds);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string, handle: string) {
    WebSession.isLoggedOut(session);
    const user = (await User.create(username, password)).user;
    await Label.createLabel(user!._id, "Following"); // create default label for a new account
    return await Profile.create(user!._id, handle);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  // TODO: incorporate time usage for a profile
  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    await Profile.addTimeActive(user, WebSession.getSessionTime(session));
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.get("/profiles")
  async getProfile(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Profile.getProfile(user);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user_id = WebSession.getUser(session);
    WebSession.end(session);
    return await Promise.all([User.delete(user_id), Profile.delete(user_id)]);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.patch("/profiles/handle/:new_handle")
  async changeHandle(session: WebSessionDoc, new_handle: string) {
    const user = WebSession.getUser(session);
    return await Profile.changeHandle(user, new_handle);
  }

  @Router.get("/profiles/following/")
  async getFollowed(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const followed = await Profile.getFollowed(user);
    return await Promise.all(followed.map(async (_id) => (await User.getUserById(_id.follows)).username));
  }

  @Router.post("/profiles/following/:username")
  async follow(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const follow = (await User.getUserByUsername(username))._id;
    await Profile.followAccount(user, follow);
    await Label.labelItem(user, "Following", username);
    return { msg: `Successfully followed '${username}'` };
  }

  @Router.delete("/profiles/following/:username")
  async unfollow(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const follow = (await User.getUserByUsername(username))._id;
    await Profile.unfollowAccount(user, follow);
    await Label.removeItemLabel(user, "Following", username);
    return { msg: `Successfully unfollowed '${username}'` };
  }

  @Router.get("/labels")
  async getAllLabels(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Label.getLabels(user);
  }

  @Router.post("/labels/:label")
  async createLabel(session: WebSessionDoc, label: string) {
    const user = WebSession.getUser(session);
    return await Label.createLabel(user, label);
  }

  @Router.delete("/labels/:label")
  async deleteLabel(session: WebSessionDoc, label: string) {
    const user = WebSession.getUser(session);
    return await Label.deleteLabel(user, label);
  }

  @Router.patch("/labels/:oldLabel&newLabel")
  async updateLabel(session: WebSessionDoc, oldLabel: string, newLabel: string) {
    const user = WebSession.getUser(session);
    return await Label.updateLabel(user, oldLabel, newLabel);
  }

  @Router.get("/itemLabels/:filter")
  async getItemsWithLabel(session: WebSessionDoc, filter: string) {
    const user = WebSession.getUser(session);
    return await Label.getLabeledItems(user, filter);
  }

  @Router.post("/itemLabels")
  async createItemLabel(session: WebSessionDoc, item: string, label: string) {
    const user = WebSession.getUser(session);
    await Label.createLabel(user, label);
    return await Label.labelItem(user, label, item);
  }

  @Router.get("/itemLabels")
  async getAllItemLabels(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Label.getAllItemLabels(user);
  }

  @Router.get("/itemLabels/:item")
  async getItemLabel(session: WebSessionDoc, item: string) {
    const user = WebSession.getUser(session);
    return await Label.getItemLabels(user, item);
  }

  @Router.delete("/itemLabels/:item&label")
  async removeItemLabel(session: WebSessionDoc, item: string, label: string) {
    const user = WebSession.getUser(session);
    return await Label.removeItemLabel(user, label, item);
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    if (await LimitedProfile.getLimited(user)) {
      const count = await LimitedProfile.getCount(user);
      if (!LimitedProfile.underLimit(count + 1)) {
        throw new NotAllowedError(`User will exceed the daily limit if they post again!`);
      }
    } else await LimitedProfile.create(user, 0);
    if (!LimitedPost.underLimit(content.length)) {
      throw new NotAllowedError(`Post has length ${content.length} > ${LimitedPost.maxLimit}`);
    }
    const created = await Post.create(user, content, options);
    await LimitedPost.create(created.post!._id, created.post!.content.length);
    const count = await LimitedProfile.getCount(user);
    await LimitedProfile.updateCount(user, count + 1);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    if (update.content) {
      const newPostLength = update.content.length;
      await LimitedPost.updateCount(_id, newPostLength);
    }
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    await LimitedPost.delete(_id);
    return await Post.delete(_id);
  }

  @Router.get("/limited_profile")
  async getLimited() {
    return await Promise.all([LimitedProfile.limited.readMany({}), LimitedPost.limited.readMany({})]);
  }

  @Router.delete("/limited_profile")
  async resetLimits() {
    return await Promise.all([LimitedPost.reset(), LimitedProfile.reset()]);
  }
}

export default getExpressRouter(new Routes());
