import type { HttpHandler } from "msw";
import { collectionsHandlers } from "./collections";
import { commentsHandlers } from "./comments";
import { filesHandlers } from "./files";
import { peopleHandlers } from "./people";
import { productsHandlers } from "./products";

export const handlers: HttpHandler[] = [
  ...collectionsHandlers,
  ...productsHandlers,
  ...commentsHandlers,
  ...filesHandlers,
  ...peopleHandlers,
];
