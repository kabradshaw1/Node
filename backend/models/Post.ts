import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Response } from './Response';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import dateFormat from '../utils/dateFormat';

export class Post extends TimeStamps {
  @prop({ required: true, minlength: 1, maxlength: 280 })
  public postText!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;

  @prop({ required: true })
  public username!: string;

  @prop({ ref: () => Response })
  public responses?: Ref<Response>[];

  public get responseCount() {
    return this.responses?.length || 0;
  }
}

export const PostModel = getModelForClass(Post);