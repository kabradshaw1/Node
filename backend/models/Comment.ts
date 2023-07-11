import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import dateFormat from '../utils/dateFormat';

export class Comment {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: true, maxlength: 280 })
  public commentBody!: string;

  @prop({ required: true })
  public username!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;
};

export const CommentModel = getModelForClass(Comment);

