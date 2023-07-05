import { AuthenticationError } from "apollo-server-express";
import { UserModel, User } from '../models/User';
import { PostModel } from '../models/Post';
import { signToken } from "../utils/auth";
import {
  MutationAddUserArgs,
  MutationLoginArgs,
  MutationAddPostArgs,
  MutationAddCommentArgs,

  QueryUserArgs,
  QueryPostArgs,
  QueryPostsArgs,

  ResolversParentTypes,
  ResolversTypes,
  Maybe,
} from '../generated/graphql';


interface Context {
  user?: Maybe<User>;
}



const resolvers = {
  Query: {
    me: async (parent: ResolversParentTypes['Query'], context: Context) => {
      if (context.user) {
        const userData = await UserModel.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('posts');

        if (!userData) {
          throw new Error('User not found');
        }
        return userData;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    user: async (parent: ResolversParentTypes['Query'], args: QueryUserArgs) => {
      const user = await UserModel.findOne({ username: args.username }).select('-__v -password').populate('posts');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
    users: async (parent: ResolversParentTypes['Query']): Promise<ResolversTypes['User'][]> => {
      return UserModel.find()
        .select('-__v -password')
        .populate('posts')
    },
    post: async (parent: ResolversParentTypes['Query'], args: QueryPostArgs): Promise<ResolversTypes['Post'] | null> => {
      return PostModel.findOne({_id: args._id})
    },
    posts: async (parent: ResolversParentTypes['Query'], args: QueryPostsArgs) => {
      const params = args.username ? { username: args.username } : {};
      const posts = await PostModel.find(params).sort({ createdAt: -1 });

      return posts;
    }


  },
  Mutation: {
    addUser: async (parent: ResolversParentTypes['Mutation'], args: MutationAddUserArgs) => {
      const user = await UserModel.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent: ResolversParentTypes['Mutation'], { email, password }: MutationLoginArgs) => {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addPost: async (parent: ResolversParentTypes['Mutation'], args: MutationAddPostArgs, context: Context) => {
      if(context.user) {
        const post = await PostModel.create({ ...args, username: context.user.username });

        await UserModel.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { posts: post._id } },
          { new: true }
        );

        return post;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addComment: async (parent: ResolversParentTypes['Mutation'], args: MutationAddCommentArgs, context: Context) => {
      if(context.user) {
        const updatedPost = await PostModel.findOneAndUpdate(
          {_id: args.PostId },
          { $push: { comments: { body: args.commentBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        if (!updatedPost) {
          throw new Error('Post not found');
        }

        return updatedPost;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  },

};

export default resolvers;