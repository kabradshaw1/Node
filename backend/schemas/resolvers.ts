import { AuthenticationError } from "apollo-server-express";
import { UserModel, User } from '../models/User';
import { PostModel, Post } from '../models/Post';
import { signToken } from "../utils/auth";
import {
  MutationAddUserArgs,
  MutationLoginArgs,
  MutationAddPostArgs,
  MutationAddCommentArgs,

  QueryUserArgs,
  QueryPostArgs,
  QueryPostsArgs,

  Resolvers,
  ResolversParentTypes,
  ResolversTypes,
  Maybe
} from '../generated/graphql';


const transformDoc = (doc: any) => {
  return {
    _id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    posts: doc.posts.map((post: any) => transformDoc(post))
  };
};

interface Context {
  user?: Maybe<User>;
}


const resolver: Resolvers = {
  Query: {
    me: async (parent: ResolversParentTypes['Query'], context: Context): Promise<ResolversTypes['User']> => {
      if (context.user) {
        const userData = await UserModel.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('posts');

        if (!userData) {
          throw new Error('User not found');
        }

        return transformDoc(userData);
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    user: async (parent: ResolversParentTypes['Query'], args: QueryUserArgs): Promise<ResolversTypes['User']> => {
      const user = await UserModel.findOne({ username: args.username }).select('-__v -password').populate('posts');

      if (!user) {
        throw new Error('User not found');
      }

      return transformDoc(user);
    },
    users: async () => {
      return UserModel.find()
        .select('-__v -password')
        .populate('posts')
    },
    post: async (parent: ResolversParentTypes['Query'], args: QueryPostArgs): Promise<ResolversTypes['Post'] | null> => {
      return PostModel.findOne({_id: args._id})
    },
    posts: async (parent: ResolversParentTypes['Query'], args: QueryPostsArgs): Promise<ResolversTypes['Post'][]> => {
      const params = args.username ? { username: args.username } : {};
      const posts = await PostModel.find(params).sort({ createdAt: -1 });

      // Transform each post document to match the expected shape
      return posts.map(post => transformDoc(post));
    }


  },
  Mutation: {
    addUser: async (parent: ResolversParentTypes['Mutation'], args: MutationAddUserArgs): Promise<ResolversTypes['Auth'] > => {
      const user = await UserModel.create(args);
      const token = signToken(user);

      return { token, user: transformDoc(user) };
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

      return { token, user: transformDoc(user) };
    },
    addPost: async (parent: ResolversParentTypes['Mutation'], args: MutationAddPostArgs, context: Context): Promise<ResolversTypes['Post']> => {
      if(context.user) {
        const post = await PostModel.create({ ...args, username: context.user.username });

        await UserModel.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { posts: post._id } },
          { new: true }
        );

        return transformDoc(post);
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addComment: async (parent: ResolversParentTypes['Mutation'], args: MutationAddCommentArgs, context: Context): Promise<ResolversTypes['Post']> => {
      if(context.user) {
        const updatedPost = await PostModel.findOneAndUpdate(
          {_id: args.PostId },
          { $push: { comments: { body: args.commentBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        if (!updatedPost) {
          throw new Error('Post not found');
        }

        return transformDoc(updatedPost);
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  },

};

export default resolver;