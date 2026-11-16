import { paginationOptsValidator } from "convex/server";
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

//Gives a mass list of all Users
export const listAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
    sortBy: v.optional(
      v.union(
        v.literal("username"),
        v.literal("reviews"),
        v.literal("listings"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const sortBy = args.sortBy ?? "username";

    if (sortBy === "username") {
      const results = await ctx.db
        .query("users")
        .withIndex("by_username")
        .order("asc")
        .paginate(args.paginationOpts);
      return {
        ...results,
        page: results.page.map((user) => ({
          _id: user._id,
          username: user.username,
          pfp: user.profilePicture,
        })),
      };
    }

    const users = await ctx.db.query("users").collect();
    const sortValues = new Map<string, number>();

    if (sortBy === "reviews") {
      const reviews = await ctx.db.query("reviews").collect();
      const ratings = new Map<string, { total: number; count: number }>();
      for (const review of reviews) {
        const rating = ratings.get(review.rateeId) ?? { total: 0, count: 0 };
        rating.total += review.score;
        rating.count += 1;
        ratings.set(review.rateeId, rating);
      }
      for (const [userId, rating] of ratings) {
        sortValues.set(userId, rating.total / rating.count);
      }
    } else {
      const listings = await ctx.db.query("listings").collect();
      for (const listing of listings) {
        sortValues.set(
          listing.ownerId,
          (sortValues.get(listing.ownerId) ?? 0) + 1,
        );
      }
    }

    const sortedUsers = users
      .map((user) => ({
        _id: user._id,
        username: user.username,
        pfp: user.profilePicture,
        sortValue: sortValues.get(user._id) ?? 0,
      }))
      .sort(
        (a, b) =>
          b.sortValue - a.sortValue ||
          a.username.localeCompare(b.username) ||
          a._id.localeCompare(b._id),
      );

    const cursor = args.paginationOpts.cursor;
    const start = cursor === null ? 0 : Number(cursor);
    if (!Number.isSafeInteger(start) || start < 0) {
      throw new Error("Invalid users pagination cursor");
    }
    const end = start + args.paginationOpts.numItems;

    return {
      page: sortedUsers.slice(start, end).map((user) => ({
        _id: user._id,
        username: user.username,
        pfp: user.pfp,
      })),
      isDone: end >= sortedUsers.length,
      continueCursor: String(end),
    };
  },
});
