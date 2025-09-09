import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! }
});

export async function putObject({ Key, Body, ContentType }: { Key: string; Body: Buffer | Uint8Array; ContentType: string }) {
  await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key, Body, ContentType, ServerSideEncryption: "AES256" }));
}
export async function deleteObject(Key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET!, Key }));
}
