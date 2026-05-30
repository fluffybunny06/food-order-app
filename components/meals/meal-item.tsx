import Link from "next/link";
import Image from "next/image";

import classes from "./meal-item.module.css";
import { getMealImageUrl } from "@/lib/images";
import type { Meal } from "@/lib/types";

type MealItemProps = Pick<
  Meal,
  "title" | "slug" | "image" | "summary" | "creator"
>;

export default function MealItem({
  title,
  slug,
  image,
  summary,
  creator,
}: MealItemProps) {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image
            src={getMealImageUrl(image)}
            alt={title}
            fill
          />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}
