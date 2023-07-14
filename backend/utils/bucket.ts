import AWS from 'aws-sdk';

export const bucket = 'dev-gql-s3-bucket';
export const bucketEndpoint = 'http://localhost:9000';

export const s3 = new AWS.S3({
  endpoint: bucketEndpoint,
  accessKeyId: 'ly1y6iMtYf',
  secretAccessKey: 'VNcmMuDARGGstqzkXF1Van1Mlki5HGU9',
  sslEnabled: false,
  s3ForcePathStyle: true,
});
