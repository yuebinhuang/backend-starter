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

    async findFriend(user: ObjectId, friend: ObjectId) {
        const circles = await this.getCirclesByUser(user);
        for (const circle of circles) {
            if (circle.members.has(friend)) {
                return circle;
            }
        }
        return undefined;
    }

    async hasAction(user: ObjectId, friend: ObjectId, action: ActionT) {
        const circle = await this.findFriend(user, friend);
        if (circle !== undefined) {
            if (circle.actions.has(action)) {
                return true;
            }
        }
        throw new NotAllowedError(`Action ${action} not allowed!`);
    }

    async addToCircle(_id: ObjectId, member: ObjectId) {
        const circle = await this.circles.readOne({ _id });
        if (circle) {
            const members = circle.members;
            if (members.has(member)) {
                throw new Error(`Circle ${circle} already has member ${member}`);
            } 
            // if member in another circle, remove it from that circle
            const currentCircle = await this.findFriend(circle.creator, member);
            if (currentCircle !== undefined) {
                this.removeFromCircle(currentCircle._id, member)
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

    async getCirclesByUser(user: ObjectId) {
        const circles = await this.circles.readMany( {creator: user} );
        return circles
    }

    async isCreator(user: ObjectId, _id: ObjectId) {
        const circle = await this.circles.readOne({ _id });
        if (!circle) {
          throw new NotFoundError(`Circle ${_id} does not exist!`);
        }
        if (circle.creator.toString() ! == user.toString()) {
          throw new NotAllowedError("not creator of circle");
        }
    }

}