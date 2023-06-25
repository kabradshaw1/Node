import { AuthenticationError } from "apollo-server-express";
import { User } from '../models';
import { IUser } from '../utils/types';
import { signToken } from "../utils/auth";

interface NewUserInput {
  username: string;
  email: string;
  password: string;
}

interface Context {
  user: UserPayload | null;
}

interface UserPayload {
  username: string;
  email: string;
  _id: string;
}

const resolver = {
  Query: {
    user: async (parent: unknown, args: {}, context: Context): Promise<IUser | null> => {
      if (context.user && context.user._id) {
        const user = await User.findById(context.user._id);
        return user;
      }
      throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    addUser: async (parent: unknown, args: NewUserInput) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    }
  }
};

export default resolver;