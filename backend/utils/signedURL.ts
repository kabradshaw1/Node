import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucket, s3 } from './bucket';

export const generateUploadURL = async (fileName: string, fileType: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    ContentType: fileType
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    console.log('The URL is', signedUrl);
    return signedUrl;
  } catch(err) {
    console.log('error getting signed url', err);
    throw err;
  }
};
