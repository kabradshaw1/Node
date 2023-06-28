import { getModelForClass, prop } from '@typegoose/typegoose';
import dateFormat from '../utils/dateFormat';

export class Response {
  @prop({ required: true, maxlength: 280 })
  public responseBody!: string;

  @prop({ required: true })
  public username!: string;

  @prop({ default: () => Date.now(), get: (timestamp: Date) => dateFormat(timestamp.getTime()) })
  public createdAt?: Date;
}

export const ResponseModel = getModelForClass(Response);
export default Response; // you need to export this to use as a reference in the Post model
