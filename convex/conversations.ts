import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, orderPair, requireUser } from "./lib";
import type { Id, Doc } from "./_generated/dataModel";

type Conversation = Doc<"conversations">;

// Joins the other participant and a small listing summary onto a conversation.
async function summarize(
  ctx: QueryCtx,
  conversation: Conversation,
  meId: Id<"users">,
) {
  const otherId =
    conversation.userA === meId ? conversation.userB : conversation.userA;
  const [other, listing] = await Promise.all([
    ctx.db.get(otherId),
    ctx.db.get(conversation.listingId),
  ]);
  return {
    ...conversation,
    otherUser:
      other === null
        ? null
        : {
            _id: other._id,
            username: other.username,
            firstName: other.firstName,
            lastName: other.lastName,
            profilePicture: other.profilePicture,
          },
    listing:
      listing === null
        ? null
        : {
            _id: listing._id,
            title: listing.title,
            price: listing.price,
            photos: listing.photos,
          },
  };
}

// My conversations, each with the other person + listing summary.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    if (me === null) {
      return null;
    }

    const [asA, asB] = await Promise.all([
      ctx.db
        .query("conversations")
        .withIndex("by_userA", (q) => q.eq("userA", me._id))
        .collect(),
      ctx.db
        .query("conversations")
        .withIndex("by_userB", (q) => q.eq("userB", me._id))
        .collect(),
    ]);

    const conversations = [...asA, ...asB].sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );

    const result = [];
    for (const conversation of conversations) {
      result.push(await summarize(ctx, conversation, me._id));
    }
    return result;
  },
});

// One conversation with its other participant + listing summary.
// (Messages themselves come from messages.list.)
export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const me = await getCurrentUser(ctx);
    if (me === null) {
      return null;
    }
    const conversation = await ctx.db.get(args.id);
    if (conversation === null) {
      return null;
    }
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }
    return await summarize(ctx, conversation, me._id);
  },
});

// Start (or reuse) a conversation about a listing. The seller is the other
// participant, so this is idempotent per (listing, buyer, seller).
export const start = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (listing === null) {
      throw new Error("Listing not found");
    }
    if (listing.ownerId === me._id) {
      throw new Error("You can't message yourself about your own listing");
    }

    const { userA, userB } = orderPair(me._id, listing.ownerId);

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_listing_pair", (q) =>
        q
          .eq("listingId", args.listingId)
          .eq("userA", userA)
          .eq("userB", userB),
      )
      .first();
    if (existing !== null) {
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert("conversations", {
      userA,
      userB,
      listingId: args.listingId,
      lastMessage: "",
      unreadCount: 0,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mark every message from the other person in this conversation as read.
export const markRead = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const conversation = await ctx.db.get(args.id);
    if (conversation === null) {
      throw new Error("Conversation not found");
    }
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }

    const otherId =
      conversation.userA === me._id ? conversation.userB : conversation.userA;
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_timestamp", (q) =>
        q.eq("conversationId", args.id),
      )
      .collect();
    for (const message of messages) {
      if (message.senderId === otherId && !message.read) {
        await ctx.db.patch(message._id, { read: true });
      }
    }

    await ctx.db.patch(args.id, { unreadCount: 0 });
    return await ctx.db.get(args.id);
  },
});

export const archive = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const conversation = await ctx.db.get(args.id);
    if (conversation === null) {
      throw new Error("Conversation not found");
    }
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }
    await ctx.db.patch(args.id, { archived: true });
    return await ctx.db.get(args.id);
  },
});

export const unarchive = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const conversation = await ctx.db.get(args.id);
    if (conversation === null) {
      throw new Error("Conversation not found");
    }
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }
    await ctx.db.patch(args.id, { archived: false });
    return await ctx.db.get(args.id);
  },
});
