import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  users: defineTable({
    email: v.string(),
    username: v.string(),
    firstName: v.string(),
    lastName: v.string(),

    dateJoined: v.number(),
    bio: v.string(),
    location: v.string(),
    profilePicture: v.string(),
  })
    .index("by_username", ["username"])
    .searchIndex("search_username", { searchField: "username" })
    .searchIndex("search_firstName", { searchField: "firstName" })
    .searchIndex("search_lastName", { searchField: "lastName" }),

  listings: defineTable({
    ownerId: v.id("users"),

    price: v.number(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    photos: v.array(v.string()),
    // Denormalized "title + description + tags" for full-text search.
    searchText: v.string(),
    // Soft-delete marker used by markSold (keeps sold items out of `list`).
    sold: v.boolean(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner_createdAt", ["ownerId", "createdAt"])
    .index("by_sold_createdAt", ["sold", "createdAt"])
    .searchIndex("search_listings", {
      searchField: "searchText",
      filterFields: ["sold"],
    }),

  saved: defineTable({
    userId: v.id("users"),
    listingId: v.id("listings"),
    savedAt: v.number(),
  })
    .index("by_user_listing", ["userId", "listingId"])
    .index("by_listing", ["listingId"]),

  conversations: defineTable({
    userA: v.id("users"),
    userB: v.id("users"),
    listingId: v.id("listings"),

    lastMessage: v.string(),
    unreadCount: v.number(),

    archived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userA", ["userA"])
    .index("by_userB", ["userB"])
    .index("by_listing_pair", ["listingId", "userA", "userB"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    body: v.string(),
    timestamp: v.number(),
    read: v.boolean(),
    messageType: v.string(), // "text" | "image" | "system"
  }).index("by_conversation_timestamp", ["conversationId", "timestamp"]),

  reviews: defineTable({
    raterId: v.id("users"),
    rateeId: v.id("users"),
    listingId: v.id("listings"),

    score: v.number(), // 1-5
    comment: v.string(),

    createdAt: v.number(),
  })
    .index("by_ratee", ["rateeId"])
    .index("by_rater", ["raterId"])
    .index("by_rater_ratee_listing", ["raterId", "rateeId", "listingId"]),

  notifications: defineTable({
    userId: v.id("users"), // recipient
    type: v.string(), // "message" | "review" | "sold"
    body: v.string(),
    listingId: v.optional(v.id("listings")),
    conversationId: v.optional(v.id("conversations")),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_user_createdAt", ["userId", "createdAt"]),
});
