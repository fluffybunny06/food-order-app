export type Meal = {
  id: number;
  slug: string;
  title: string;
  image: string;
  summary: string;
  instructions: string;
  creator: string;
  creator_email: string;
};

export type MealFormInput = {
  title: string;
  summary: string;
  instructions: string;
  image: File;
  creator: string;
  creator_email: string;
};

export type ShareMealState = {
  message: string | null;
  meal: {
    name: string;
    email: string;
    title: string;
    summary: string;
    instructions: string;
  };
};
