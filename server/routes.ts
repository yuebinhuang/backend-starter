import { ObjectId, W } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Friend, Post, User, WebSession, Profile, Circle, Chat, Comment, Feed, Recommend} from "./app";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";
import { ContentT, ActionT } from "./types";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
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
  async createPost(session: WebSessionDoc, content: ContentT, viewers: Set<ObjectId>, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, viewers, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.patch("posts/changeViewers/:_id")
  async changePostViewers(session: WebSessionDoc, _id: ObjectId, viewers: Set<ObjectId>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.changeViewers(_id, viewers)
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  @Router.get("/profile/:owner")
  async getProfile(session: WebSessionDoc, owner: ObjectId) {
    const viewer = WebSession.getUser(session);
    return await Profile.getProfile(owner, viewer);
  }

  @Router.post("/profile/create")
  async createProfile(session: WebSessionDoc, name: string, content: ContentT) {
    const user = WebSession.getUser(session);
    return await Profile.createProfile(user, name, content);
  }

  @Router.patch("/profile/update/:_id")
  async updateProfile(session: WebSessionDoc, _id: ObjectId, name: string, content: ContentT) {
    const user = WebSession.getUser(session);
    await Profile.isCreator(user, _id);
    return await Profile.updateProfile(_id, name, content);
  }

  @Router.post("/profile/create_view/")
  async createProfileView(session: WebSessionDoc, owner: ObjectId, name: string) {
    const user = WebSession.getUser(session);
    await Friend.isNotFriends(user, owner);
    return await Profile.createProfileView(owner, user, name);
  }

  @Router.patch("/profile/change_view/:_id")
  async changeProfileView(session: WebSessionDoc, _id: ObjectId, name: string) {
    const user = WebSession.getUser(session);
    await Friend.isNotFriends(user, await Profile.getCreator(_id));
    return await Profile.changeProfileView(_id, name);
  }

  @Router.post("/circle/create")
  async createCircle(session: WebSessionDoc, members: Set<ObjectId>, name: string, actions: Set<ActionT>) {
    const user = WebSession.getUser(session);
    return await Circle.createCircle(user, members, name, actions);
  }

  @Router.delete("/circle/delete/:_id")
  async deleteCircle(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Circle.isCreator(user, _id);
    return await Circle.deleteCircle(_id);
  }

  @Router.get("/circles")
  async getCircles(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Circle.getCirclesByUser(user);
  }

  @Router.patch("/circle/add/:_id")
  async addToCircle(session: WebSessionDoc, _id: ObjectId, member: ObjectId) {
    const user = WebSession.getUser(session);
    await Circle.isCreator(user, _id);
    return await Circle.addToCircle(_id, member);
  }

  @Router.patch("/circle/remove/:_id")
  async removeFromCircle(session: WebSessionDoc, _id: ObjectId, member: ObjectId) {
    const user = WebSession.getUser(session);
    await Circle.isCreator(user, _id);
    return await Circle.removeFromCircle(_id, member);
  }

  @Router.patch("/circle/change/:_id")
  async changeCircleActions(session: WebSessionDoc, _id: ObjectId, actions: Set<ActionT>) {
    const user = WebSession.getUser(session);
    await Circle.isCreator(user, _id);
    return await Circle.changeActions(_id, actions);
  }

  @Router.get("/chat/:receiver")
  async getChat(session: WebSessionDoc, receiver: ObjectId) {
    const user = WebSession.getUser(session);
    return await Chat.getChat(user, receiver);
  }

  @Router.post("/chat/create")
  async createChat(session: WebSessionDoc, receiver: ObjectId, content: ContentT) {
    const user = WebSession.getUser(session);
    await Circle.hasAction(user, receiver, "Chat");
    await Circle.hasAction(receiver, user, "Chat");
    return await Chat.createChat(user, receiver, content);
  }

  @Router.patch("/chat/send/:receiver")
  async sendMessage(session: WebSessionDoc, receiver: ObjectId, content: ContentT) {
    const user = WebSession.getUser(session);
    await Circle.hasAction(user, receiver, "Chat");
    await Circle.hasAction(receiver, user, "Chat");
    return await Chat.sendMessage(user, receiver, content);
  }

  @Router.get("/comments/:post")
  async getComments(session: WebSessionDoc, post: ObjectId) {
    const user = WebSession.getUser(session);
    await Circle.hasAction(await Post.getAuthor(post), user, "ViewPost");
    await Circle.hasAction(await Post.getAuthor(post), user, "ViewPostComments");
    const comments = await Comment.getComments(post);
    return comments.filter(comment => comment.viewers.has(user));
  }

  @Router.post("/comment/create")
  async comment(session: WebSessionDoc, post: ObjectId, viewers: Set<ObjectId>, message: ContentT) {
    const user = WebSession.getUser(session);
    await Circle.hasAction(await Post.getAuthor(post), user, "Comment");
    return await Comment.comment(user, viewers, post, message);
  }

  @Router.delete("/comment/delete/:_id")
  async deleteComment(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(user, _id);
    return await Comment.delComment(_id);
  }

  @Router.get("/feed/:owner")
  async getFeed(session: WebSessionDoc, owner: ObjectId) {
    const viewer = WebSession.getUser(session);
    if (viewer.toString() === owner.toString()) {
      return await Feed.getFeed(owner);
    }
    await Circle.hasAction(owner, viewer, "ViewFeed");
    return await Feed.getFeed(owner);
  }

  @Router.post("/feed/create")
  async createFeed(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const viewers: Set<ObjectId> = new Set();
    const posts: ObjectId[] = [];
    for (const friend of await Friend.getFriends(user)) {
      // only posts that person is allowed to see appears on their feed
      if (await Circle.hasAction(friend, user, "ViewPost")) {
        const friendPosts = await Post.getByAuthor(friend);
        posts.concat(friendPosts.map(post => post._id));
      }
      // viewers who are allowed to see the person's feed
      if (await Circle.hasAction(user, friend, "ViewFeed")) {
        viewers.add(friend);
      }
    }
    return await Feed.createFeed(user, viewers, posts, new Date());
  }

  @Router.patch("/feed/update")
  async updateFeed(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const posts: ObjectId[] = [];
    for (const friend of await Friend.getFriends(user)) {
      // only posts that person is allowed to see appears on their feed
      if (await Circle.hasAction(friend, user, "ViewPost")) {
        const friendPosts = await Post.getByAuthor(friend);
        posts.concat(friendPosts.map(post => post._id));
      }
    }
    return await Feed.updateFeed(user, posts, new Date());
  }

  @Router.patch("/feed/changeViewers")
  async changeFeedViewers(session: WebSessionDoc, viewers: Set<ObjectId>) {
    const user = WebSession.getUser(session);
    return await Feed.changeViewers(user, viewers);
  }

  @Router.get("recommends")
  async getRecs(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Recommend.getRecsbyTarget(user);
  }

  @Router.post("/recommend/create/:post/:target")
  async recommend(session: WebSessionDoc, post: ObjectId, target: ObjectId) {
    const user = WebSession.getUser(session);
    await Circle.hasAction(target, user, "Recommend");
    return await Recommend.recommend(user, post, target);
  }

  @Router.delete("/recommend/delete/:_id")
  async removeRec(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Recommend.isRecommender(user, _id);
    return await Recommend.removeRec(_id);
  }

}

export default getExpressRouter(new Routes());
