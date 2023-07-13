import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';
import db from './config/connection';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import processRequest  from 'graphql-upload/processRequest.mjs';

// const s3 = new S3Client({ region: 'us-east-1a'});

// let storage;
// if (process.env.NODE_ENV === 'production') {
//   // In production, use S3
//   storage = multerS3({
//     s3: s3,
//     bucket: 'tricypaa',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString()) // use Date.now() for unique file keys
//     }
//   });
// } else {
//   // In development, store files locally
//   storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname)
//     }
//   });
// }

// const upload = multer({ storage: storage });

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100000
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

// endpoint to handle file uploads
// app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
//   if(!req.file) {
//     return
//   }
//   res.json({ imageUrl: `/uploads/${req.file.filename}`});
// });

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
