import { getModelForClass, prop, Ref, index, plugin, pre, modelOptions, Severity } from '@typegoose/typegoose';
import { Response } from './Response';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import * as mongoose from 'mongoose';
import * as dateFormat from '../utils/dateFormat';

@index({ username: 1 })
@modelOptions({ options: { customName: 'Post' }, schemaOptions: { toJSON: { virtuals: true, getters: true, versionKey: false }, toObject: { virtuals: true }, timestamps: true } })
class Post extends TimeStamps {
  @prop({ required: true, minlength: 1, maxlength: 280 })
  public PostText!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp) })
  public createdAt?: Date;

  @prop({ required: true })
  public username!: string;

  @prop({ ref: () => response })
  public responses?: Ref<Response>[];

  public get responseCount() {
    return this.responses?.length || 0;
  }
}

export const PostModel = getModelForClass(Post);
