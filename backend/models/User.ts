import { prop, getModelForClass, pre, DocumentType, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Post } from './Post';
import bcrypt from 'bcrypt';

@pre<User>('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
})
export class User {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: true, trim: true })
  public username!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, minlength: 5 })
  public password!: string;

  @prop({ ref: () => Post })
  public posts?:Ref<Post>[];

  @prop({ required: true, default: false })
  public isAdmin: boolean;

  public async isCorrectPassword(this: DocumentType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserModel = getModelForClass(User);
