import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  listings: defineTable({
    title: v.string(),
    price: v.number(),
    description: v.string(),
    tags: v.array(v.string()),
  }),
});
