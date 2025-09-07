"use server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.S3_DJSS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESSKEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function getObjectURL(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_DJSS_BUCKET_NAME!,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}

export async function putObjectInS3(
  Key: string,
  file: File
): Promise<PutObjectCommandOutput> {
  const Body = Buffer.from(await file.arrayBuffer());
  const command = new PutObjectCommand({
    Bucket: process.env.S3_DJSS_BUCKET_NAME!,
    Key,
    Body,
  });
  try {
    const data = await s3Client.send(command);
    return data;
  } catch (error) {
    throw error;
  }
}
