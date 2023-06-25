import { AuthenticationError } from "apollo-server-express";
import { User } from '../models';
import { signToken } from "../utils/auth";

const resolver = {
  Query: {},
  Mutation: {}
};

export default resolver;