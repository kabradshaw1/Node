import { getModelForClass, prop, modelOptions, Severity } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Comment } from './Comment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import dateFormat from '../utils/dateFormat';

@modelOptions({ options: { allowMixed: Severity.ALLOW } }) // allow mixed types for subdocuments
export class Post extends TimeStamps {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: true, minlength: 1, maxlength: 280 })
  public postText!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;

  @prop({ required: true })
  public username!: string;

  @prop({ _id: false }) // remove the _id field from subdocuments
  public comments?: Comment[]; // no need to initialize an empty array here

  public get commentCount() {
    return this.comments?.length || 0;
  }
}

export const PostModel = getModelForClass(Post);
