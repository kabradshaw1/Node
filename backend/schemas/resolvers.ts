import { AuthenticationError } from "apollo-server-express";
import { User } from '../models';
import { IUser, Auth } from '../utils/types';
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
    addUser: async (parent: unknown, args: NewUserInput): Promise<Auth | null> => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent: unknown, { email, password }: {email:string, password:string}): Promise<Auth | null> => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  },

};

export default resolver;