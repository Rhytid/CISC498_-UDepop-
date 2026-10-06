import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Shared shape for a listing's writable fields. Keeps the schema and the
// functions in agreement as new fields are added.
const listingFields = {
  ownerId: v.id("users"),

  price: v.number(),
  title: v.string(),
  description: v.string(),
  tags: v.array(v.string()),
  photos: v.array(v.string()),

  createdAt: v.number(),
  updatedAt: v.number(),
};

export const create = mutation({
  args: listingFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("listings", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
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
    await ctx.db.replace(id, {
      ...fields,
      updatedAt: Date.now(),
    });
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
