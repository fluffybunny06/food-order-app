import slugify from "slugify";
import xss from "xss";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env";
import { prisma } from "./prisma";
import type { Meal, MealFormInput } from "./types";
import type { Meal as PrismaMeal } from "@prisma/client";

const s3 = new S3Client({ region: env.awsRegion });

function mapMeal(meal: PrismaMeal): Meal {
  return {
    id: meal.id,
    slug: meal.slug,
    title: meal.title,
    image: meal.imageKey,
    summary: meal.summary,
    instructions: meal.instructions,
    creator: meal.creatorName,
    creator_email: meal.creatorEmail,
  };
}

export async function getMeals(): Promise<Meal[]> {
  const meals = await prisma.meal.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return meals.map(mapMeal);
}

export async function getMeal(slug: string): Promise<Meal | undefined> {
  const meal = await prisma.meal.findUnique({
    where: {
      slug,
    },
  });

  return meal ? mapMeal(meal) : undefined;
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

  await prisma.meal.create({
    data: {
      slug,
      title: meal.title,
      imageKey: fileName,
      summary: meal.summary,
      instructions,
      creatorName: meal.creator,
      creatorEmail: meal.creator_email,
    },
  });
}
