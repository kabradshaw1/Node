import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import dateFormat from '../utils/dateFormat';

export class Event extends TimeStamps {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: true, minlength: 1, maxlength:30 })
  public title!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;

  @prop({ required: true })
  public date!: Date;

  @prop({ required: true })
  public username!: string;

  @prop({ maxlength: 100 })
  public fileName?: string;

  @prop({ maxlength:300 })
  public description?: string;
};

export const EventModel = getModelForClass(Event);