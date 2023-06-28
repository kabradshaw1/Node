import { getModelForClass, prop } from '@typegoose/typegoose';
import dateFormat from '../utils/dateFormat';

export class Comment {
  @prop({ required: true, maxlength: 280 })
  public commentBody!: string;

  @prop({ required: true })
  public username!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;
}

export const CommentModel = getModelForClass(Comment);

