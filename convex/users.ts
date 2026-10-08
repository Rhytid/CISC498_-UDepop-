import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireUser } from "./lib";

// Editable profile fields. `email` and `tokenIdentifier` are managed by auth,
// not by updateProfile.
const profileFields = {
  username: v.optional(v.string()),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  bio: v.optional(v.string()),
  location: v.optional(v.string()),
  profilePicture: v.optional(v.string()),
};

// Current logged-in user's profile (null when not authenticated).
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// Public profile by username (for /username).
export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
  },
});

// Profile by internal id (used inside other queries).
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Edit name, bio, avatar, campus.
export const updateProfile = mutation({
  args: profileFields,
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    // Keep usernames unique.
    const username = args.username;
    if (username !== undefined && username !== user.username) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", username))
        .unique();
      if (existing !== null) {
        throw new Error("Username is already taken");
      }
    }

    await ctx.db.patch(user._id, args);
    return await ctx.db.get(user._id);
  },
});

// Find people by name/username. Returns at most `limit` results, deduped.
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = args.query.trim();
    if (query === "") {
      return [];
    }
    const limit = args.limit ?? 20;

    const [byUsername, byFirstName, byLastName] = await Promise.all([
      ctx.db
        .query("users")
        .withSearchIndex("search_username", (q) => q.search("username", query))
        .take(limit),
      ctx.db
        .query("users")
        .withSearchIndex("search_firstName", (q) =>
          q.search("firstName", query),
        )
        .take(limit),
      ctx.db
        .query("users")
        .withSearchIndex("search_lastName", (q) => q.search("lastName", query))
        .take(limit),
    ]);

    const seen = new Set<string>();
    const results = [];
    for (const user of [...byUsername, ...byFirstName, ...byLastName]) {
      if (seen.has(user._id)) {
        continue;
      }
      seen.add(user._id);
      results.push(user);
      if (results.length >= limit) {
        break;
      }
    }
    return results;
  },
});
