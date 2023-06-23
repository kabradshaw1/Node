import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isCorrectPassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
});

// set up pre-save middleware to create password
userSchema.pre<IUser>('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
