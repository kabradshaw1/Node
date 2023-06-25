import path from 'path';
import fs from 'fs';
import resolvers from './resolvers';

const typeDefs = fs.readFileSync(path.join(__dirname, './typeDefs.graphql'), 'utf8');

export { typeDefs, resolvers };