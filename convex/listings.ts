import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser, notify } from "./lib";

// Fields a client may write when creating/editing a listing. Owner, sold flag
// and timestamps are derived server-side.
const listingInput = {
  title: v.string(),
  description: v.string(),
  category: v.string(),
  price: v.number(),
  tags: v.array(v.string()),
  photos: v.array(v.string()),
};

// Full-text search payload, kept in sync with title/description/tags.
function buildSearchText(args: {
  title: string;
  description: string;
  tags: string[];
}) {
  return [args.title, args.description, ...args.tags].join(" ").toLowerCase();
}

export const create = mutation({
  args: listingInput,
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    return await ctx.db.insert("listings", {
      ownerId: user._id,
      title: args.title,
      description: args.description,
      category: args.category,
      price: args.price,
      tags: args.tags,
      photos: args.photos,
      searchText: buildSearchText(args),
      sold: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const list = query({
  args: {
    searchText: v.optional(v.string()),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    includeSold: v.optional(v.boolean()),
    paginationOpts: v.optional(
      v.object({ numItems: v.number(), cursor: v.union(v.string(), v.null()) }),
    ),
  },
  handler: async (ctx, args) => {
    const paginationOpts = args.paginationOpts ?? { numItems: 50, cursor: null };
    const includeSold = args.includeSold ?? false;

    const base = args.searchText
      ? ctx.db
          .query("listings")
          .withSearchIndex("search_listings", (q) =>
            q
              .search("searchText", args.searchText as string)
              .eq("sold", false),
          )
      : includeSold
        ? ctx.db.query("listings").order("desc")
        : ctx.db
            .query("listings")
            .withIndex("by_sold_createdAt", (q) => q.eq("sold", false))
            .order("desc");

    return await base
      .filter((q) => {
        const conditions = [];
        if (args.category !== undefined) {
          conditions.push(q.eq(q.field("category"), args.category));
        }
        if (args.minPrice !== undefined) {
          conditions.push(q.gte(q.field("price"), args.minPrice));
        }
        if (args.maxPrice !== undefined) {
          conditions.push(q.lte(q.field("price"), args.maxPrice));
        }
        if (conditions.length === 0) {
          return true;
        }
        if (conditions.length === 1) {
          return conditions[0];
        }
        return q.and(...conditions);
      })
      .paginate(paginationOpts);
  },
});

export const get = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (listing === null) {
      return null;
    }
    const seller = await ctx.db.get(listing.ownerId);
    return {
      ...listing,
      seller:
        seller === null
          ? null
          : {
              _id: seller._id,
              username: seller.username,
              firstName: seller.firstName,
              lastName: seller.lastName,
              profilePicture: seller.profilePicture,
            },
    };
  },
});

// All listings by a seller -> powers /username/listings.
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_owner_createdAt", (q) => q.eq("ownerId", args.userId))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: { id: v.id("listings"), ...listingInput },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const { id, ...fields } = args;

    const listing = await ctx.db.get(id);
    if (listing === null) {
      throw new Error("Listing not found");
    }
    if (listing.ownerId !== user._id) {
      throw new Error("You can only edit your own listings");
    }

    await ctx.db.patch(id, {
      ...fields,
      searchText: buildSearchText(fields),
      updatedAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (listing === null) {
      throw new Error("Listing not found");
    }
    if (listing.ownerId !== user._id) {
      throw new Error("You can only delete your own listings");
    }

    // Clean up saved rows pointing at this listing.
    const saves = await ctx.db
      .query("saved")
      .withIndex("by_listing", (q) => q.eq("listingId", args.id))
      .collect();
    for (const save of saves) {
      await ctx.db.delete(save._id);
    }

    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});

// Mark as sold (or un-sold) instead of hard-deleting.
export const markSold = mutation({
  args: { id: v.id("listings"), sold: v.boolean() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (listing === null) {
      throw new Error("Listing not found");
    }
    if (listing.ownerId !== user._id) {
      throw new Error("You can only update your own listings");
    }

    await ctx.db.patch(args.id, { sold: args.sold, updatedAt: Date.now() });

    // When an item sells, let everyone who saved it know.
    if (args.sold) {
      const saves = await ctx.db
        .query("saved")
        .withIndex("by_listing", (q) => q.eq("listingId", args.id))
        .collect();
      for (const save of saves) {
        if (save.userId !== user._id) {
          await notify(ctx, {
            userId: save.userId,
            type: "sold",
            body: `"${listing.title}" was just marked as sold.`,
            listingId: listing._id,
          });
        }
      }
    }

    return await ctx.db.get(args.id);
  },
});

// Full-text search across titles/descriptions/tags.
export const search = query({
  args: {
    query: v.string(),
    includeSold: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const query = args.query.trim();
    if (query === "") {
      return [];
    }
    const base = ctx.db
      .query("listings")
      .withSearchIndex("search_listings", (q) => q.search("searchText", query));
    if (args.includeSold) {
      return await base.take(20);
    }
    return await base.filter((q) => q.eq(q.field("sold"), false)).take(20);
  },
});
