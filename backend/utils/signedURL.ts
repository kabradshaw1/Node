import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucket, s3 } from './bucket';

const generateUploadURL = async (prop: string, fileName: string, fileType: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: prop,
    Key: fileName,
    ContentType: fileType
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log('The URL is', signedUrl);
    return signedUrl;
  } catch(err) {
    console.log('error getting signed url', err);
    throw err;
  }
};

export const generateProdUploadURL = (fileName: string, fileType: string) => {
  if (bucket)
    return generateUploadURL(bucket, fileName, fileType);
};

export const generateDevUploadURL = async (fileName: string, fileType: string)  => {
  if (bucket)
    return generateUploadURL(bucket, fileName, fileType)
};
