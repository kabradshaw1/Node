import { Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  isCorrectPassword: (password: string) => Promise<boolean>;
}
