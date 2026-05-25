import type { HttpHandler } from "msw";
import { collectionsHandlers } from "./collections";
import { commentsHandlers } from "./comments";
import { customFieldsHandlers } from "./custom-fields";
import { filesHandlers } from "./files";
import { peopleHandlers } from "./people";
import { productsHandlers } from "./products";
import { tagsHandlers } from "./tags";

export const handlers: HttpHandler[] = [
  ...collectionsHandlers,
  ...productsHandlers,
  ...tagsHandlers,
  ...customFieldsHandlers,
  ...commentsHandlers,
  ...filesHandlers,
  ...peopleHandlers,
];
