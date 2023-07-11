// utils/admin.ts
import { User } from '../models/User'
import { AuthenticationError } from "apollo-server-express";

export  const isAdmin = (user: User) => {
  if (!user.isAdmin) {
    throw new AuthenticationError('Only admins can perform this operation');
  }
};
