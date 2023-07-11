import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';
import db from './config/connection';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new S3Client({ region: 'us-east-1a'});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'tricypaa', 
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()) // use Date.now() for unique file keys
    }
  })
});

const PORT = 4000;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// endpoint to handle file uploads
app.post('/upload', upload.array('photos', 3), (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    return next(new Error('Files not found'));
  }

  const files = req.files as Express.Multer.File[];
  res.send('Successfully uploaded ' + files.length + ' files!');
});

const startApolloServer = async (typeDefs: any, resolvers: any) => {
  await server.start();
  server.applyMiddleware({ app, path: '/api' });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

startApolloServer(typeDefs, resolvers);
