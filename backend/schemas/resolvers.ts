import { GraphQLError } from 'graphql';
import { UserModel, User } from '../models/User';
import { PostModel } from '../models/Post';
import { EventModel } from '../models/Event'
import { signToken } from "../utils/auth";
import {
  MutationAddUserArgs,
  MutationLoginArgs,
  MutationAddPostArgs,
  MutationAddCommentArgs,
  MutationAddEventArgs,

  QueryUserArgs,
  QueryPostArgs,
  QueryPostsArgs,

  ResolversParentTypes,
  Maybe,
} from '../generated/graphql';
import { isAdmin } from '../utils/admin'
import {generateUploadURL, generateDownloadURL} from '../utils/signedURL';

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

      throw new GraphQLError('You need to be logged in!');
    },
    user: async (parent: ResolversParentTypes['Query'], args: QueryUserArgs) => {
      const user = await UserModel.findOne({ username: args.username }).select('-__v -password').populate('posts');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
    users: async (parent: ResolversParentTypes['Query']) => {
      return UserModel.find()
        .select('-__v -password')
        .populate('posts')
    },
    post: async (parent: ResolversParentTypes['Query'], args: QueryPostArgs) => {
      return PostModel.findOne({_id: args._id}).populate('comments')
    },
    posts: async (parent: ResolversParentTypes['Query'], args: QueryPostsArgs) => {
      const params = args.username ? { username: args.username } : {};
      const posts = await PostModel.find(params).sort({ createdAt: -1 });

      return posts;
    },
    events: async (parent: ResolversParentTypes['Query']) => {
        console.log('stuff')
        const events = await EventModel.find();
        // const eventsWithSignedURLs = await Promise.all(events.map(async (event) => {
        //     let eventObject = event.toObject();
        //     let eventWithOptionalFields: any = {
        //         ...eventObject,
        //         ...(event.fileName ? {signedURL: await generateDownloadURL(event.fileName)} : {}),
        //     };

        //     if (event.description) {
        //         eventWithOptionalFields.description = event.description;
        //     }
        //     return eventWithOptionalFields;
        // }));
        return events;
    }
  },
  Mutation: {
    addEvent: async (parent: ResolversParentTypes['Mutation'], args:MutationAddEventArgs, context: Context) => {
      if (context.user) {
        isAdmin(context.user)
        let UploadURL;
        if(args.fileName && args.fileType) {
          UploadURL = await generateUploadURL(args.fileName, args.fileType);
        };
        await EventModel.create({...args, username: context.user.username});
        return {signedURL: UploadURL};
      }
      throw new GraphQLError('You need to be logged in!');
    },
    addUser: async (parent: ResolversParentTypes['Mutation'], args: MutationAddUserArgs) => {
      const user = await UserModel.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent: ResolversParentTypes['Mutation'], { email, password }: MutationLoginArgs) => {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new GraphQLError('In correct credentials!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new GraphQLError('In correct credentials!');
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

      throw new GraphQLError('You need to be logged in!');
    },
    addComment: async (parent: ResolversParentTypes['Mutation'], args: MutationAddCommentArgs, context: Context) => {
      if(context.user) {
        const newComment = {
          commentBody: args.commentBody,
          username: context.user.username
        };

        const updatedPost = await PostModel.findOneAndUpdate(
          { _id: args.PostId },
          { $push: { comments: newComment } },
          { new: true, runValidators: true }
        );

        if (!updatedPost) {
          throw new Error('Post not found');
        };

        return updatedPost;
      }

      throw new GraphQLError('You need to be logged in!');
    },
  },

};

export default resolvers;