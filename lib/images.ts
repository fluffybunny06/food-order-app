import { env } from "./env";

export function getMealImageUrl(imageKey: string): string {
  const normalizedImageKey = imageKey.replace(/^\//, "");
  return `${env.s3PublicBaseUrl}/${normalizedImageKey}`;
}
