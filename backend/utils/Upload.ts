import { bucket, s3 } from './bucket'

export const generateDevUploadURL = (fileName: string): string | void  => {
  const params = {
    Bucket: bucket,
    Key: fileName, //not sure what to do here yet
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
  })
};