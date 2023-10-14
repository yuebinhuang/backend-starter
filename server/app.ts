import ChatConcept from "./concepts/chat";
import CircleConcept from "./concepts/circle";
import CommentConcept from "./concepts/comment";
import FeedConcept from "./concepts/feed";
import FriendConcept from "./concepts/friend";
import PostConcept from "./concepts/post";
import ProfileConcept from "./concepts/profile";
import RecommendConcept from "./concepts/recommend";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Profile = new ProfileConcept();
export const Circle = new CircleConcept();
export const Chat = new ChatConcept();
export const Comment = new CommentConcept();
export const Feed = new FeedConcept();
export const Recommend = new RecommendConcept();
