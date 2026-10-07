import { mutation } from "./_generated/server";
import { orderPair } from "./lib";

// Development-only helper: populates a small demo dataset so the interactive
// test screens in src/app/tests/ have data to show before Convex Auth is
// wired up. Refuses to run once a real auth identity is present.
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity !== null) {
      throw new Error("seed is dev-only (disable auth to use it)");
    }

    const now = Date.now();

    const alice = await ctx.db.insert("users", {
      email: "alice@example.com",
      username: "alice",
      firstName: "Alice",
      lastName: "Anderson",
      dateJoined: now,
      bio: "Selling my dorm gear",
      location: "Kingston",
      profilePicture: "",
    });
    const bob = await ctx.db.insert("users", {
      email: "bob@example.com",
      username: "bob",
      firstName: "Bob",
      lastName: "Brown",
      dateJoined: now,
      bio: "Looking for textbooks",
      location: "Kingston",
      profilePicture: "",
    });

    const lamp = await ctx.db.insert("listings", {
      ownerId: alice,
      title: "Desk Lamp",
      description: "Works great, barely used.",
      category: "Dorm",
      price: 12,
      tags: ["dorm", "lighting"],
      photos: [],
      searchText: "desk lamp works great, barely used. dorm lighting",
      sold: false,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("listings", {
      ownerId: bob,
      title: "Calculus Textbook",
      description: "No highlighting, 8th edition.",
      category: "Books",
      price: 40,
      tags: ["textbook", "math"],
      photos: [],
      searchText: "calculus textbook no highlighting, 8th edition. textbook math",
      sold: false,
      createdAt: now + 1,
      updatedAt: now + 1,
    });

    await ctx.db.insert("saved", {
      userId: bob,
      listingId: lamp,
      savedAt: now,
    });

    const { userA, userB } = orderPair(alice, bob);
    const conversation = await ctx.db.insert("conversations", {
      userA,
      userB,
      listingId: lamp,
      lastMessage: "Is this still available?",
      unreadCount: 1,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("messages", {
      conversationId: conversation,
      senderId: bob,
      body: "Is this still available?",
      timestamp: now,
      read: false,
      messageType: "text",
    });

    await ctx.db.insert("reviews", {
      raterId: bob,
      rateeId: alice,
      listingId: lamp,
      score: 5,
      comment: "Great seller, smooth pickup.",
      createdAt: now,
    });

    await ctx.db.insert("notifications", {
      userId: alice,
      type: "message",
      body: "Bob Brown: Is this still available?",
      listingId: lamp,
      conversationId: conversation,
      read: false,
      createdAt: now,
    });

    return { seeded: true };
  },
});
