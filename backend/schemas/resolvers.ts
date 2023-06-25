import { AuthenticationError } from "apollo-server-express";
import { User } from '../models';
import { IUser } from '../utils/types';
import { signToken } from "../utils/auth";
import { JwtPayload } from "jsonwebtoken";

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
        const user = await User.findById(context.user._id).populate({
          path: ''
        });

        return user
      }
       throw new AuthenticationError('Not logged in')
    }

  },
  Mutation: {}
};

export default resolver;