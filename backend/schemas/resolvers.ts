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
  MutationUpdateUserArgs,
  MutationUpdateEventArgs,
} from '../generated/graphql';
import { isAdmin } from '../utils/admin'
import {generateUploadURL, generateDownloadURL} from '../utils/signedURL';
import fotmatTimestamp from '../utils/dateFormat';
import timeZone from '../utils/timeZone';

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
      const now = timeZone(new Date());
      const events = await EventModel.find({ date: { $gt: now } });
      const eventsWithSignedURLs = await Promise.all(events.map(async (event) => {
          const { fileName, date, ...rest } = event.toObject();
          let signedURL = null;

          if (fileName) {
              signedURL = await generateDownloadURL(fileName);
          }

          return {
              ...rest,
              fileName,
              signedURL,
              date: fotmatTimestamp(date.getTime())
          };
      }));

      return eventsWithSignedURLs;
  }


  },
  Mutation: {
    addEvent: async (parent: ResolversParentTypes['Mutation'], args:MutationAddEventArgs, context: Context) => {
      if (context.user) {
        isAdmin(context.user)
        let UploadURL;
        let fileNameWithDate
        if(args.fileName && args.fileType) {
          fileNameWithDate = `${args.fileName}_${new Date().toString}`
          UploadURL = await generateUploadURL(fileNameWithDate, args.fileType);
        };
        await EventModel.create({date: timeZone(new Date(args.date), 'EST'), description: args.description, title: args.title, fileName: fileNameWithDate ,username: context.user.username, address: args.address});
        return {signedURL: UploadURL};
      }
      throw new GraphQLError('You need to be logged in!');
    },
    addUser: async (parent: ResolversParentTypes['Mutation'], args: MutationAddUserArgs) => {
      const user = await UserModel.create(args);
      const token = signToken(user);

      return { token, user };
    },
    updateUser: async (parent: ResolversParentTypes['Mutation'], args: MutationUpdateUserArgs, context: Context) => {
      if (context.user) {
        const user = await UserModel.findByIdAndUpdate(context.user._id, args, { new: true });
        const token = signToken(user);
        return { token, user };
      }
      throw new GraphQLError('You are not logged in!')
    },
    updateEvent: async (parent: ResolversParentTypes['Mutation'], args: MutationUpdateEventArgs, context: Context) => {
      if (context.user) {
        isAdmin(context.user);
        let UploadURL;
        let fileNameWithDate;
        if(args.fileName && args.fileType) {
          fileNameWithDate = `${args.fileName}_${new Date().toString()}`;
          UploadURL = await generateUploadURL(fileNameWithDate, args.fileType);
        };

        let updateObj: {
          description?: string | undefined | null,
          title?: string | undefined | null,
          fileName?: string | undefined,
          username?: string,
          address: string | undefined | null,
          date?: Date,
        } = {
          description: args.description,
          title: args.title,
          fileName: fileNameWithDate,
          username: context.user.username,
          address: args.address,
        };

        if (args.date !== undefined && args.date !== null) {
          updateObj.date = timeZone(new Date(args.date), 'EST');
        }

        await EventModel.findByIdAndUpdate(updateObj);
      }
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