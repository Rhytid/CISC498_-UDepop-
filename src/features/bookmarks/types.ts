// Shared Convex-derived types for saved bookmarks and their associated listings.
// Keeps the bookmarks feature aligned with the backend query result shape.
import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";

export type SavedBookmarks = NonNullable<
  FunctionReturnType<typeof api.saved.list>
>;
export type SavedBookmark = SavedBookmarks[number];
export type SavedListing = NonNullable<SavedBookmark["listing"]>;
