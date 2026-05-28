import type { HttpHandler } from "msw";
import { collectionsHandlers } from "./collections";
import { commentsHandlers } from "./comments";
import { customFieldsHandlers } from "./custom-fields";
import { filesHandlers } from "./files";
import { libraryHandlers } from "./library";
import { notificationsHandlers } from "./notifications";
import { peopleHandlers } from "./people";
import { productsHandlers } from "./products";
import { tagsHandlers } from "./tags";
import { viewsHandlers } from "./views";
import { worklistViewsHandlers } from "./worklist-views";
import { workspaceHandlers } from "./workspace";

export const handlers: HttpHandler[] = [
  ...workspaceHandlers,
  ...collectionsHandlers,
  ...productsHandlers,
  ...tagsHandlers,
  ...customFieldsHandlers,
  ...commentsHandlers,
  ...filesHandlers,
  ...libraryHandlers,
  ...notificationsHandlers,
  ...peopleHandlers,
  ...viewsHandlers,
  ...worklistViewsHandlers,
];
