import stream from 'stream';

import { bucket, s3 } from './bucket'

export const generateDevUploadURL = (fileName: string) => {
  const params = {
    Bucket: bucket,
    key: fileName, //not sure what to do here yet
    Expires: 60,
  };
  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.log('error getting signed url', err);
      return err;
    } else {
      console.log('The URL is', url);
      return url;
    }
  });
};