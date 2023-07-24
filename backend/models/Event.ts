import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import dateFormat from '../utils/dateFormat';
import timeZone from '../utils/timeZone';

export class Event extends TimeStamps {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: true, minlength: 1, maxlength:80 })
  public title!: string;

  @prop({ default: () => timeZone(new Date, 'EST'), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;

  @prop({ required: true })
  public date!: Date;

  @prop({ required: true })
  public address!: string;

  @prop({ required: true })
  public username!: string;

  @prop({ maxlength: 100 })
  public fileName?: string;

  @prop({ maxlength:300 })
  public description?: string;
};

export const EventModel = getModelForClass(Event);