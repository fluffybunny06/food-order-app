import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env";
import type { Meal, MealFormInput } from "./types";

const s3 = new S3Client({ region: env.awsRegion });

const db = sql("meals.db");

export async function getMeals(): Promise<Meal[]> {
  return db.prepare("SELECT * FROM meals").all() as Meal[];
}

export function getMeal(slug: string): Meal | undefined {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug) as
    | Meal
    | undefined;
}

export async function saveMeal(meal: MealFormInput): Promise<void> {
  const slug = slugify(meal.title, { lower: true });
  const instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop()!;
  const fileName = `${slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: env.s3Bucket,
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    })
  );

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
  ).run({
    slug,
    title: meal.title,
    image: fileName,
    summary: meal.summary,
    instructions,
    creator: meal.creator,
    creator_email: meal.creator_email,
  });
}
