import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({region: process.env.REGION});

export const generateUploadURL = async (fileName: string, fileType: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
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

export const generateDownloadURL = async (fileName: string): Promise<string> => {
  // Define the parameters for the GetObjectCommand
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  });

  try {
    // Generate the signed URL
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log('The URL is', signedUrl);
    return signedUrl;
  } catch (err) {
    console.log('Error getting signed URL', err);
    throw err;
  }
};
