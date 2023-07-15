import { S3Client } from "@aws-sdk/client-s3";

const isProduction = process.env.PRODUCTION === 'true';

export const bucket = isProduction ? process.env.BUCKET_NAME : 'dev-gql-s3-bucket';
export const bucketEndpoint = 'http://localhost:9000';
const s3Config = isProduction
  ? { region: process.env.REGION }
  : {
      endpoint: bucketEndpoint,
      credentials: {
        accessKeyId: 'ly1y6iMtYf',
        secretAccessKey: 'VNcmMuDARGGstqzkXF1Van1Mlki5HGU9',
      },
    };

export const s3 = new S3Client(s3Config);
