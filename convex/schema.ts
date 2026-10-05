import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  listings: defineTable({
    title: "string",
    price: "number",
    description: "string",
    tags: "array",
  }),
});
