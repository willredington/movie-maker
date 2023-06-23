import * as AWS from "aws-sdk";
import { RunTimeEnvVariable, getEnvVariable } from "../config";

const s3 = new AWS.S3();

const EXPIRATION_IN_SECONDS = 3600; // 1 hour

export async function createPresignedUrl({ projectId }: { projectId: string }) {
  return await s3.getSignedUrlPromise("getObject", {
    Bucket: getEnvVariable(RunTimeEnvVariable.VIDEO_BUCKET_NAME),
    Key: `${projectId}.mp4`,
    Expires: EXPIRATION_IN_SECONDS,
  });
}
