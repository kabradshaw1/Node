import { bucket, s3 } from './bucket'

export const generateDevUploadURL = async (fileName: string): Promise<string> => {
  const params = {
    Bucket: bucket,
    Key: fileName,
    Expires: 60,
  };
  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    console.log('The URL is', url);
    return url;
  } catch(err) {
    console.log('error getting signed url', err);
    throw err;
  }
};