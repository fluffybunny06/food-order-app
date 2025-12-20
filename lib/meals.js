import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION || "us-east-1";
const S3_BUCKET =
  process.env.S3_BUCKET || "yexuanzhang-nextjs-demo-users-image";
const s3 = new S3Client({ region: REGION });

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    })
  );

  meal.image = fileName;

  db.prepare(
    `
    INSERT INTO meals
      (slug, title, image, summary, instructions, creator, creator_email) 
    VALUES (
      @slug,
      @title,
      @image,
      @summary,
      @instructions,
      @creator,
      @creator_email
    ) 
  `
  ).run(meal);
}
