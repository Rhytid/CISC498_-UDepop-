import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),

    username: v.string(),
    firstName: v.string(),
    lastName: v.string(),

    dateJoined: v.number(),
    bio: v.string(),
    location: v.string(),
    profilePicture: v.string(),
  }),

  listings: defineTable({
    ownerId: v.id("users"),

    price: v.number(),
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    photos: v.array(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
