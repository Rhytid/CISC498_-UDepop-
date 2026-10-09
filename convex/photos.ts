import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireUser } from "./lib";

// Get a signed upload URL (Convex file storage).
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

// Link an uploaded photo to a listing.
export const attach = mutation({
  args: {
    listingId: v.id("listings"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (listing === null) {
      throw new Error("Listing not found");
    }
    if (listing.ownerId !== user._id) {
      throw new Error("You can only edit your own listings");
    }

    const photos = [...listing.photos, args.storageId];
    await ctx.db.patch(args.listingId, { photos, updatedAt: Date.now() });
    return await ctx.db.get(args.listingId);
  },
});

// Remove a photo from a listing and delete the stored file.
export const removePhoto = mutation({
  args: {
    listingId: v.id("listings"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (listing === null) {
      throw new Error("Listing not found");
    }
    if (listing.ownerId !== user._id) {
      throw new Error("You can only edit your own listings");
    }

    const photos = listing.photos.filter((id) => id !== args.storageId);
    await ctx.db.patch(args.listingId, { photos, updatedAt: Date.now() });
    await ctx.storage.delete(args.storageId);
    return await ctx.db.get(args.listingId);
  },
});
