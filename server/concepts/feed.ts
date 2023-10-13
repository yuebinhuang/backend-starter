import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";
import {ContentT} from "../types"

export interface FeedDoc extends BaseDoc {
    owner: ObjectId;
    viewers: Set<ObjectId>;
    timestamp: Date;
    posts: ObjectId[];
}

export default class FeedConcept {

    public readonly feeds = new DocCollection<FeedDoc>("feeds");

    async updateFeed(user: ObjectId, viewers: Set<ObjectId>, posts: ObjectId[], timestamp: Date) {

        const feed = await this.feeds.readOne( {user} );
        if (feed === null) {
            const newFeed = {
                owner: user,
                viewers: viewers,
                timestamp: timestamp,
                posts: posts.filter(post => post.getTimestamp() >= timestamp)
            };
            const _id = await this.feeds.createOne( newFeed );
            return { msg: "Fresh feed created!" };
        } else {
            const newPosts = feed.posts.concat(posts).filter(post => post.getTimestamp() >= timestamp);
            const update: Partial<FeedDoc> = { posts: newPosts, timestamp: timestamp };
            await this.feeds.updateOne( {_id: feed._id}, update);
            return { msg: "Feed updated!" };
        }

    }

    async getFeed(_id: ObjectId) {
        const feed = await this.feeds.readOne( {_id} );
        if (feed === null) {
            throw new NotFoundError(`Feed not found!`);
        }
        return feed;
    }

    async changeViewers(_id: ObjectId, viewers: Set<ObjectId>) {
        const feed = await this.feeds.readOne( {_id} );
        if (feed === null) {
            throw new NotFoundError(`Feed not found!`);
        } else {
            const update: Partial<FeedDoc> = { viewers: viewers };
            await this.feeds.updateOne({ _id}, update);
        }
    }
    
}