import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';
import db from './config/connection';
import multer from 'multer';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 500000
  }
})

const PORT = 4000;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  console.log(req.file);
  res.sendStatus(200);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startApolloServer = async (typeDefs: any, resolvers: any) => {
  await server.start();
  server.applyMiddleware({ app, path: '/api/graphql' });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

startApolloServer(typeDefs, resolvers);
