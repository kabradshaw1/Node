// utils/admin.ts
import { User } from '../models/User'
import { GraphQLError } from 'graphql';

export  const isAdmin = (user: User) => {
  if (!user.isAdmin) {
    throw new GraphQLError('Only admins can perform this operation');
  }
};
