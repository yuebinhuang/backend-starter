import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";
import {ContentT} from "../types"

export interface CommentDoc extends BaseDoc {
    author: ObjectId;
    viewers: Set<ObjectId>;
    post: ObjectId;
    message: ContentT;
}

export default class CommentConcept {

    public readonly comments = new DocCollection<CommentDoc>("comments");

    async comment(author: ObjectId, viewers: Set<ObjectId>, post: ObjectId, message: ContentT) {
        const _id = await this.comments.createOne({author, viewers, post, message});
        return {msg: "Comment uploaded successfully!"};
    }

    async delComment(_id: ObjectId) {
        await this.comments.deleteOne({_id});
        return {msg: "Comment deleted!"};
    }

    async getAuthor(_id: ObjectId) {
        const comment = await this.comments.readOne({ _id });
        if (!comment) {
          throw new NotFoundError(`Comment ${_id} does not exist!`);
        }
        return comment.author;
    }
    
    async isAuthor(user: ObjectId, _id: ObjectId) {
        const comment = await this.comments.readOne({ _id });
        if (!comment) {
          throw new NotFoundError(`Comment ${_id} does not exist!`);
        }
        if (comment.author.toString() ! == user.toString()) {
          throw new NotAllowedError("not author of comment");
        }
    }

    async getComments(post: ObjectId) {
        const comments = await this.comments.readMany({post: post});
        return comments;
    }
    
}
