import { AuthenticationError } from "apollo-server-express";
import { UserModel, User } from '../models/User';
import { PostModel, Post } from '../models/Post';
import { CommentModel, Comment } from '../models/Comment';
import { signToken } from "../utils/auth";
import {
  Resolvers,
  MutationAddUserArgs,
  MutationLoginArgs,
  MutationAddPostArgs,
  MutationAddCommentArgs,
  QueryUserArgs,
  ResolversParentTypes,
  ResolversTypes
} from '../generated/graphql';

const resolver: Resolvers = {
  Query: {
    user: async (parent: ResolversParentTypes['Query'], args: QueryUserArgs): Promise<ResolversTypes['User']> => {
      const user = await UserModel.findOne({ username: args.unsername }).select('-__v -password').populate('posts')

      return user;
    }
  },
  Mutation: {
    addUser: async (parent: ResolversParentTypes['Mutation'], args: MutationAddUserArgs): Promise<ResolversTypes['Auth']> => {
      const user = await UserModel.create(args);
      const token = signToken(user);

      return { token, user};
    },
    login: async (parent: ResolversParentTypes['Mutation'], { email, password }: MutationLoginArgs): Promise<ResolversTypes['Auth']> => {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user:{_id: user._id.toString(), email: user.email, username: user.username} };
    }
  },

};

export default resolver;