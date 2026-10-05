import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

//Querying the database to get data
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("Items").collect();
  },
});
//Adding to the database
//Follow the syntax in schema.ts to see how to make a category
//Follow syntax in ItemDisplay.tsx to see how to implement
export const add = mutation({
  args: {
    Name: v.string(),
    Price: v.number(),
    Tags: v.array(v.object({ value: v.string(), label: v.string() })),
    Description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("Items", args);
  },
});

//Removing something from the database
//Implementation in ItemDisplay.tsx
export const remove = mutation({
  args: { id: v.id("Items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
