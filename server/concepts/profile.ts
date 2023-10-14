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

    async getCreator(_id: ObjectId) {
        const profile = await this.profiles.readOne({_id});
        if (profile === null) {
            throw new NotFoundError(`Profile not found!`);
        }
        return profile.owner;
    }

    async isCreator(user: ObjectId, _id: ObjectId) {
        const profile = await this.profiles.readOne({ _id });
        if (!profile) {
          throw new NotFoundError(`Profile ${_id} does not exist!`);
        }
        if (profile.owner.toString() !== user.toString()) {
          throw new ProfileCreatorNotMatchError(user, _id);
        }
    }

    async createProfile(owner: ObjectId, name: string, content: ContentT) {
        const _id = await this.profiles.createOne({ owner: owner, viewer: undefined, name: name, content: content });
        return { msg: "Profile created successfully!"};
    }

    async updateProfile(_id: ObjectId, name: string, content: ContentT) {
        // updateProfile is for the original view of the profile
        const existingProfile = await this.profiles.readOne({ _id });
        if (existingProfile) {
            const update: Partial<ProfileDoc> = { name: name, content: content };
            await this.profiles.updateOne({ _id }, update);
            return { msg: "Profile updated successfully!" };
        } else {
            throw new NotFoundError("Profile not found!");
        }
    }

    async createProfileView(owner: ObjectId, viewer: ObjectId, name: string) {
        const nobody = undefined;
        const existingProfile = await this.profiles.readOne({ owner, nobody });
        if (existingProfile) {
            const _id = await this.profiles.createOne({ owner: owner, viewer: viewer, name: name, content: existingProfile.content });
            return { msg: "Profile view created successfully!" };
        } else {
            throw new NotFoundError(`Profile with ${owner} as owner is not found!`);
        }
    }

    async changeProfileView(_id: ObjectId, name: string) {
        // Check if the profile view exists
        const existingView = await this.profiles.readOne({ _id });
        if (existingView) {
            const update: Partial<ProfileDoc> = { name: name };
            await this.profiles.updateOne({ _id }, update);
            return { msg: "Profile view changed successfully!" };
        // If not, create a profile view instead
        } else {
            throw new NotFoundError("Profile view not found!");
        }

    }

}

export class ProfileCreatorNotMatchError extends NotAllowedError {
    constructor(
      public readonly creator: ObjectId,
      public readonly _id: ObjectId,
    ) {
      super("{0} is not the creator of post {1}!", creator, _id);
    }
  }