import { AuthenticationError } from 'apollo-server-express';
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
  MutationSingleUploadArgs,

  QueryUserArgs,
  QueryPostArgs,
  QueryPostsArgs,

  ResolversParentTypes,
  Maybe,
} from '../generated/graphql';
import dateScalar from "../utils/dateScalar";
import { isAdmin } from '../utils/admin'
import fs from 'fs';
// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

interface Context {
  user?: Maybe<User>;
  // s3: S3Client;
}

const resolvers = {
  Date: dateScalar,
  // Upload: GraphQLUpload,
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
    }


  },
  Mutation: {
    singleUpload: async (parent: ResolversParentTypes['Mutation'], { file }: MutationSingleUploadArgs) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();
      const path = `${process.cwd()}/uploads/${filename}`;

      return new Promise((resolve, reject) => {
        stream
          .on('error', (error: any) => {
            if (stream.trucated) {
              fs.unlinkSync(path);
            }
            reject(error);
          })
          .pipe(fs.createWriteStream(path))
          .on('error', reject)
          .on('finish', resolve);

          return { filename, mimetype, encoding };
      })
    },
    addEvent: async (parent: ResolversParentTypes['Mutation'], args: MutationAddEventArgs, context: Context) => {
      if (context.user) {
        isAdmin(context.user); // this will throw an error if the user is not an admin
        console.log(args)
        let filePath = null;
        if (args.file) {
          const { createReadStream, filename } = await args.file;
          const stream = createReadStream();

          // if (process.env.NODE_ENV === 'production') {
          //   const params = {
          //     Bucket: 'tricypaa',
          //     Key: Date.now().toString(),
          //     Body: stream,
          //     ContentType: mimetype,
          //   };
          //   await context.s3.send(new PutObjectCommand(params));
          //   filePath = `https://tricypaa.s3.amazonaws.com/${params.Key}`;
          // } else {
            try {
              const path = `./uploads/${Date.now()}-${filename}`;
              const writeStream = fs.createWriteStream(path);
              stream.pipe(writeStream);
              await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', (error) => {
                  fs.unlink(path, () => {}); // remove the file
                  reject(error);
                });
              });
              filePath = path;
            } catch (error) {
              // handle error, e.g. by logging it and returning an error response
              console.error('File upload failed:', error);
              throw new Error('File upload failed');
            }
          // }
        };

        const event = await EventModel.create({ ...args, file: filePath });
        return event;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
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

      throw new AuthenticationError('You need to be logged in!');
    },


  },

};

export default resolvers;