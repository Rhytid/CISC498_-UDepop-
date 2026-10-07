import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireUser } from "./lib";

// Save a listing (idempotent — saving twice is a no-op).
export const add = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (listing === null) {
      throw new Error("Listing not found");
    }

    const existing = await ctx.db
      .query("saved")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", user._id).eq("listingId", args.listingId),
      )
      .first();
    if (existing !== null) {
      return existing._id;
    }

    return await ctx.db.insert("saved", {
      userId: user._id,
      listingId: args.listingId,
      savedAt: Date.now(),
    });
  },
});

// Unsave a listing.
export const remove = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query("saved")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", user._id).eq("listingId", args.listingId),
      )
      .first();
    if (existing !== null) {
      await ctx.db.delete(existing._id);
    }
    return { removed: existing !== null };
  },
});

// Current user's saved items, with the listing joined in.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return null;
    }

    const saves = await ctx.db
      .query("saved")
      .withIndex("by_user_listing", (q) => q.eq("userId", user._id))
      .collect();

    const items = [];
    for (const save of saves) {
      const listing = await ctx.db.get(save.listingId);
      if (listing !== null) {
        items.push({ _id: save._id, savedAt: save.savedAt, listing });
      }
    }
    return items;
  },
});

// Heart-state check for one listing.
export const isSaved = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return false;
    }
    const existing = await ctx.db
      .query("saved")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", user._id).eq("listingId", args.listingId),
      )
      .first();
    return existing !== null;
  },
});
