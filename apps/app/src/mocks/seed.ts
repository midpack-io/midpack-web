import { COLLECTIONS } from "./data/collections";
import { PRODUCTS } from "./data/products";
import { PEOPLE } from "./data/people";
import { ACTIVITY } from "./data/activity";
import { COMMENTS } from "./data/comments";
import { FILES } from "./data/files";
import { NOTIFICATIONS } from "./data/notifications";

export function seed(): void {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(
      "[mocks] seeded",
      COLLECTIONS.length,
      "collections,",
      PRODUCTS.length,
      "products,",
      PEOPLE.length,
      "people,",
      ACTIVITY.length,
      "activity items,",
      COMMENTS.length,
      "comments,",
      FILES.length,
      "files,",
      NOTIFICATIONS.length,
      "notifications",
    );
  }
}
