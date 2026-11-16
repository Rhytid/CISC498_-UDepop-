import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";

export type SavedBookmarks = NonNullable<
  FunctionReturnType<typeof api.saved.list>
>;
export type SavedBookmark = SavedBookmarks[number];
export type SavedListing = NonNullable<SavedBookmark["listing"]>;
