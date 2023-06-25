import { AuthenticationError } from "apollo-server-express";
import { User } from '../models';
import { IUser } from '../utils/types';
import { signToken } from "../utils/auth";

interface Context {
  user: UserPayload | null;
}

interface UserPayload {
  userName: string;
  email: string;
  _id: string;
}

const resolver = {
  Query: {
    user: async (partent: unknown, args:{}, context: Context): Promise<IUser | void | null>  => {
      if(context.user) {
        const user = await User.findById(context.user._id)

        return user
      }
       throw new AuthenticationError('Not logged in')
    }

  },
  Mutation: {
    addUser: async (parent: unknown, args:{ userName:string, email:string, password:string }) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    }
  }
};

export default resolver;