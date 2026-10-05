import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Shared shape for a listing's writable fields. Keeps the schema and the
// functions in agreement as new fields are added.
const listingFields = {
  title: v.string(),
  price: v.number(),
  description: v.string(),
  tags: v.array(v.string()),
};

export const create = mutation({
  args: listingFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("listings", args);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("listings").collect();
  },
});

export const get = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("listings"), ...listingFields },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.replace(id, fields);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});
