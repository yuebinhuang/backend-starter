import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";
import {ContentT} from "../types"

export interface ProfileDoc extends BaseDoc {
    owner: ObjectId;
    viewer: ObjectId | undefined;
    name: string;
    content: ContentT;
}

// TODO: need to change viewer so that its not undefined and check for connections

export default class ProfileConcept {

    public readonly profiles = new DocCollection<ProfileDoc>("profiles");

    async getProfile(owner: ObjectId, viewer: ObjectId | undefined) {
        if (owner.toString() === viewer?.toString()) {
            viewer = undefined;
        }
        const profile = await this.profiles.readOne( {owner, viewer} );
        if (profile === null) {
            throw new NotFoundError(`Profile not found!`);
        }
        return profile;
    }

    async updateProfile(owner: ObjectId, name: string, content: ContentT) {
        // updateProfile is for the original view of the profile
        const viewer = undefined;
        // Check if the profile exists
        const existingProfile = await this.profiles.readOne({ owner, viewer });
        if (existingProfile) {
            const update: Partial<ProfileDoc> = { name: name, content: content };
            await this.profiles.updateOne({ owner, viewer }, update);
            return { msg: "Profile updated successfully!" };
        // Create profile instead
        } else {
            const _id = await this.profiles.createOne({ owner: owner, viewer: undefined, name: name, content: content });
            return { msg: "Profile created successfully!"};
        }
    }

    async changeProfile(owner: ObjectId, viewer: ObjectId, name: string) {
        // Check if the profile view exists
        const existingView = await this.profiles.readOne({ owner, viewer });
        if (existingView) {
            const update: Partial<ProfileDoc> = { name: name };
            await this.profiles.updateOne({ owner, viewer }, update);
            return { msg: "Profile view changed successfully!" };
        // Check if the profile exists instead and edit that
        } else {
            const nobody = undefined;
            const existingProfile = await this.profiles.readOne({ owner, nobody });
            if (existingProfile) {
                const _id = await this.profiles.createOne({ owner: owner, viewer: viewer, name: name, content: existingProfile.content });
                return { msg: "Profile view created successfully!" };
            } else {
                throw new NotFoundError(`Profile with ${owner} as owner is not found!`);
            }
        }

    }



}