import { bucket, s3 } from './bucket';

const generateUploadURL = async (prop: string, fileName: string): Promise<string> => {
  const params = {
    Bucket: prop,
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

export const generateProdUploadURL = (fileName: string) => {
  if (process.env.BUCKET_NAME)
  return generateUploadURL(process.env.BUCKET_NAME, fileName);
};

export const generateDevUploadURL = async (fileName: string, fileType: string): Promise<string>  => {
  const params = {
    Bucket: bucket,
    Key: fileName,
    Expires: 60,
    ContentType: fileType
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

