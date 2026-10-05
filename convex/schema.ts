import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  //Follow this convention to add a new category to the database
  Items: defineTable({
    Name: v.string(),
    Price: v.number(),
    Tags: v.array(v.object({ label: v.string(), value: v.string() })),
    Description: v.string(),
  }),
  /*
  Users: defineTable({
    Username: v.string(),
    Password: v.string(),
    Items: v.array(v.Item()),
    Rating:v.number(),
    })
  */
});
