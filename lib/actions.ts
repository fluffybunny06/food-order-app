"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";
import type { MealFormInput, ShareMealState } from "./types";

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isInvalidText(text: string): boolean {
  return text.trim() === "";
}

export async function shareMeal(
  prevState: ShareMealState,
  formData: FormData
): Promise<ShareMealState> {
  const image = formData.get("image");
  const meal = {
    title: getText(formData, "title"),
    summary: getText(formData, "summary"),
    instructions: getText(formData, "instructions"),
    image: image instanceof File ? image : null,
    creator: getText(formData, "name"),
    creator_email: getText(formData, "email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@")
  ) {
    return {
      message: "Invalid input.",
      meal: {
        title: meal.title,
        summary: meal.summary,
        instructions: meal.instructions,
        name: meal.creator,
        email: meal.creator_email,
      },
    };
  }

  if (meal.image === null || meal.image.size === 0) {
    return {
      message: "Invalid input.",
      meal: {
        title: meal.title,
        summary: meal.summary,
        instructions: meal.instructions,
        name: meal.creator,
        email: meal.creator_email,
      },
    };
  }

  const submittedMeal: MealFormInput = {
    ...meal,
    image: meal.image,
  };

  await saveMeal(submittedMeal);
  revalidatePath("/meals");
  redirect("/meals");
}
