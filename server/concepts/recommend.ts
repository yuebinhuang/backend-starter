import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";
import {ContentT} from "../types"

export interface RecommendDoc extends BaseDoc {
    recommender: ObjectId;
    post: ObjectId;
    target: ObjectId;
}

export default class RecommendConcept {

    public readonly recs = new DocCollection<RecommendDoc>("recommends");

    async getRec(_id: ObjectId) {
        const rec = await this.recs.readOne({_id});
        if (rec === null) {
            throw new NotFoundError("Recommendation not found!");
        } 
        return rec;
    }

    async recommend(recommender: ObjectId, post: ObjectId, target: ObjectId) {
        const rec = await this.recs.readOne({recommender, post, target});
        if (rec === null) {
            await this.recs.createOne({recommender, post, target});
            return {msg: "Recommendation sent!"}
        } else {
            throw new NotAllowedError("Recommendation already exists!");
        }
    }

    async removeRec(_id: ObjectId) {
        await this.recs.deleteOne({ _id });
        return { msg: "Recommendation removed successfully!" };
    }

}