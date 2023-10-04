import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";
import { ActionT } from "../types";

export interface CircleDoc extends BaseDoc {
    creator: ObjectId;
    members: Set<ObjectId>;
    name: string;
    actions: Set<ActionT>;
}

export default class CircleConcept {

    public readonly circles = new DocCollection<CircleDoc>("circles");

    async createCircle(creator: ObjectId, members: Set<ObjectId>, name: string, actions: Set<ActionT>) {
        const _id = await this.circles.createOne({ creator: creator, members: members, name: name, actions: actions });
        return { msg: "Circle successfully created!", post: await this.circles.readOne({ _id }) };
    }

    async deleteCircle(_id: ObjectId) {
        await this.circles.deleteOne({ _id });
        return { msg: "Post deleted successfully!" };
    }

    async addToCircle(_id: ObjectId, member: ObjectId) {
        const circle = await this.circles.readOne({ _id });
        if (circle) {
            const members = circle.members;
            if (members.has(member)) {
                throw new Error(`Circle ${circle} already has member ${member}`);
            }
            members.add(member);
            const update: Partial<CircleDoc> = { members: members };
            await this.circles.updateOne( {_id}, update);
            return { msg: "Member added to circle!" };
        } else {
            throw new NotFoundError(`Circle ${_id} not found!`)
        }
    }

    async removeFromCircle(_id: ObjectId, member: ObjectId) {
        const circle = await this.circles.readOne({ _id });
        if (circle) {
            const members = circle.members;
            if (!members.has(member)) {
                throw new Error(`Circle ${circle} does not have member ${member}`);
            }
            members.delete(member)
            const update: Partial<CircleDoc> = { members: members };
            await this.circles.updateOne( {_id}, update);
            return { msg: "Member removed from circle!" }
        } else {
            throw new NotFoundError(`Circle ${_id} not found!`)
        }
    }

    async changeActions(_id: ObjectId, actions: Set<ActionT>) {
        const circle = await this.circles.readOne({ _id });
        if (circle) {
            const update: Partial<CircleDoc> = { actions: actions };
            await this.circles.updateOne({_id}, update);
            return { msg: "Circle actions updated successfully!" };
        } else {
            throw new NotFoundError(`Circle ${_id} not found!`)
        }
    }

    async getCircle(_id: ObjectId) {
        const circle = await this.circles.readOne( {_id} );
        if (circle === null) {
            throw new NotFoundError(`Circle not found!`);
        }
        return circle;
    }

}