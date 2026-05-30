const DEFAULT_AWS_REGION = "us-east-1";
const DEFAULT_S3_BUCKET = "yexuanzhang-nextjs-demo-users-image";
const DEFAULT_S3_PUBLIC_BASE_URL = `https://${DEFAULT_S3_BUCKET}.s3.amazonaws.com`;

function removeTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export const env = {
  awsRegion: process.env.AWS_REGION || DEFAULT_AWS_REGION,
  s3Bucket: process.env.S3_BUCKET || DEFAULT_S3_BUCKET,
  s3PublicBaseUrl: removeTrailingSlash(
    process.env.S3_PUBLIC_BASE_URL || DEFAULT_S3_PUBLIC_BASE_URL
  ),
};
