import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, notify, requireUser } from "./lib";

// Rate a buyer/seller after a transaction. The reviewed user is the listing
// owner; the reviewer is the current user.
export const create = mutation({
  args: {
    listingId: v.id("listings"),
    score: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const rater = await requireUser(ctx);
    if (args.score < 1 || args.score > 5) {
      throw new Error("Score must be between 1 and 5");
    }

    const listing = await ctx.db.get(args.listingId);
    if (listing === null) {
      throw new Error("Listing not found");
    }
    const rateeId = listing.ownerId;
    if (rateeId === rater._id) {
      throw new Error("You can't review yourself");
    }

    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_rater_ratee_listing", (q) =>
        q
          .eq("raterId", rater._id)
          .eq("rateeId", rateeId)
          .eq("listingId", args.listingId),
      )
      .first();
    if (existing !== null) {
      throw new Error("You already reviewed this listing");
    }

    const reviewId = await ctx.db.insert("reviews", {
      raterId: rater._id,
      rateeId,
      listingId: args.listingId,
      score: args.score,
      comment: args.comment ?? "",
      createdAt: Date.now(),
    });

    await notify(ctx, {
      userId: rateeId,
      type: "review",
      body: `${rater.firstName} ${rater.lastName} left you a ${args.score}-star review`,
      listingId: args.listingId,
    });

    return await ctx.db.get(reviewId);
  },
});

// Reviews about a user -> powers the profile page.
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_ratee", (q) => q.eq("rateeId", args.userId))
      .collect();

    const result = [];
    for (const review of reviews) {
      const rater = await ctx.db.get(review.raterId);
      result.push({
        ...review,
        rater:
          rater === null
            ? null
            : {
                _id: rater._id,
                username: rater.username,
                firstName: rater.firstName,
                lastName: rater.lastName,
                profilePicture: rater.profilePicture,
              },
      });
    }
    return result;
  },
});

// Aggregate star rating for a user.
export const getRating = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_ratee", (q) => q.eq("rateeId", args.userId))
      .collect();
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const total = reviews.reduce((sum, review) => sum + review.score, 0);
    return { average: total / reviews.length, count: reviews.length };
  },
});

// Reviews I've written, with the reviewed user's info (null when not authenticated).
export const listByMe = query({
  args: {},
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    if (me === null) {
      return null;
    }
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_rater", (q) => q.eq("raterId", me._id))
      .collect();

    const result = [];
    for (const review of reviews) {
      const ratee = await ctx.db.get(review.rateeId);
      result.push({
        ...review,
        ratee:
          ratee === null
            ? null
            : {
                _id: ratee._id,
                username: ratee.username,
                profilePicture: ratee.profilePicture,
              },
      });
    }
    return result;
  },
});

// Delete a review I wrote.
export const remove = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const review = await ctx.db.get(args.reviewId);
    if (review === null) {
      throw new Error("Review not found");
    }
    if (review.raterId !== me._id) {
      throw new Error("You can only delete your own reviews");
    }
    await ctx.db.delete(args.reviewId);
  },
});
