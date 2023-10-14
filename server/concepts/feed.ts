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

    async getOwner(_id: ObjectId) {
        const feed = await this.feeds.readOne({ _id });
        if (!feed) {
          throw new NotFoundError(`Feed ${_id} does not exist!`);
        }
        return feed.owner;
    }

    async createFeed(user: ObjectId, viewers: Set<ObjectId>, posts: ObjectId[], timestamp: Date) {
        const newFeed = {
            owner: user,
            viewers: viewers,
            timestamp: timestamp,
            posts: posts.sort(post => post.getTimestamp().getTime())
        };
        const _id = await this.feeds.createOne( newFeed );
        return { msg: "Fresh feed created!" };
    }

    async updateFeed(user: ObjectId, posts: ObjectId[], timestamp: Date) {

        const feed = await this.feeds.readOne( {user} );
        if (feed === null) {
            throw new NotFoundError("Feed not found!");
        } else {
            const newPosts = posts.filter(post => post.getTimestamp() >= feed.timestamp).sort(post => post.getTimestamp().getTime());
            const update: Partial<FeedDoc> = { posts: newPosts, timestamp: timestamp };
            await this.feeds.updateOne( {_id: feed._id}, update);
            return { msg: "Feed updated!" };
        }

    }

    async getFeed(user: ObjectId) {
        const feed = await this.feeds.readOne( {user} );
        if (feed === null) {
            throw new NotFoundError(`Feed not found!`);
        }
        return feed;
    }

    async changeViewers(user: ObjectId, viewers: Set<ObjectId>) {
        const feed = await this.feeds.readOne( {user} );
        if (feed === null) {
            throw new NotFoundError(`Feed not found!`);
        } else {
            const update: Partial<FeedDoc> = { viewers: viewers };
            await this.feeds.updateOne({ user }, update);
        }
    }
    
}