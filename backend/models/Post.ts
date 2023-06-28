import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Comment } from './Comment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import dateFormat from '../utils/dateFormat';

export class Post extends TimeStamps {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: true, minlength: 1, maxlength: 280 })
  public postText!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;

  @prop({ required: true })
  public username!: string;

  @prop({ ref: () => Comment })
  public comments?: Ref<Comment>[];

  public get commentCount() {
    return this.comments?.length || 0;
  }
}

export const PostModel = getModelForClass(Post);