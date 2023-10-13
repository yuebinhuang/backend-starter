import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";
import {ContentT} from "../types"

export interface ChatDoc extends BaseDoc {
    user1: ObjectId;
    user2: ObjectId;
    content: [ObjectId, ContentT][];
}

export default class ChatConcept {

    public readonly chats = new DocCollection<ChatDoc>("chats");

    async getChat(_id: ObjectId){
        const chat = await this.chats.readOne( {_id} );
        if (chat === null) {
            throw new NotFoundError(`Chat not found!`);
        }
        return chat;
    }

    async sendMessage(sender: ObjectId, receiver: ObjectId, content: ContentT) {
        const chat = await this.chats.readOne({ $or: [{user1: sender, user2: receiver}, {user1: receiver, user2: sender}] });
        if (chat === null) {
            const _id = await this.chats.createOne( {user1: sender, user2: receiver, content: [[sender, content]]} );
            return { msg: "Chat started successfully!" };
        } else {
            chat.content.push([sender, content]);
            const update: Partial<ChatDoc> = { content: chat.content };
            await this.chats.updateOne( {_id: chat._id}, update)
            return { msg: "Message sent successfully!" };
        }
    }

}