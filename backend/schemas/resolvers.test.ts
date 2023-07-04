import { UserModel } from '../models/User';
import  resolvers  from './resolvers';
import { AuthenticationError } from "apollo-server-express";
import mockingoose from 'mockingoose';

console.log(resolvers);

// describe('Query.me', () => {
//   it('throws an error if user is not authenticated', async () => {
//     const args = {};
//     const context = { user: null };

//     await expect(resolvers.Query.me(null, args, context)).rejects.toThrow(AuthenticationError);
//   });

//   it('returns the authenticated user', async () => {
//     const args = {};
//     const context = { user: { _id: 'userid' } };

//     const userData = {
//       _id: 'userid',
//       username: 'test',
//       email: 'test@test.com',
//       posts: []
//     };

//     // Here we mock the UserModel's findOne method
//     mockingoose(UserModel).toReturn(userData, 'findOne');

//     const result = await resolvers.Query.me(null, args, context);
//     expect(result).toEqual({
//       _id: 'userid',
//       username: 'test',
//       email: 'test@test.com',
//       posts: []
//     });
//   });
// });
