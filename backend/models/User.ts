import { prop, getModelForClass, pre, plugin, DocumentType } from '@typegoose/typegoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import { IUser } from '../utils/types';

@pre<IUser>('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
})
@plugin(mongooseUniqueValidator)
class User {
  @prop({ required: true, trim: true })
  public username!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, minlength: 5 })
  public password!: string;

  public async isCorrectPassword(this: DocumentType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

export default getModelForClass(User);
