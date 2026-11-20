import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  getCurrentUser,
  getOrCreateConversationForListing,
  notify,
  requireUser,
} from "./lib";

// Messages in a conversation, oldest first.
export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const me = await getCurrentUser(ctx);
    if (me === null) {
      return null;
    }
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation === null) {
      throw new Error("Conversation not found");
    }
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation_timestamp", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
  },
});
export const sendSoldNotice = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);

    const conversation = await ctx.db.get(args.conversationId);
    if (conversation === null) throw new Error("Conversation not found");
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }

    const listing = await ctx.db.get(conversation.listingId);
    if (listing === null) throw new Error("Listing not found");
    if (listing.ownerId !== me._id) {
      throw new Error("Only the listing owner can do this");
    }

    const buyerId =
      conversation.userA === me._id ? conversation.userB : conversation.userA;
    const buyer = await ctx.db.get(buyerId);
    if (buyer === null) throw new Error("Buyer not found");

    const now = Date.now();
    const body = `Hi ${buyer.firstName}! ${me.firstName} marked "${listing.title}" as sold to you. /reviewPage?listingId=${conversation.listingId}`;

    await ctx.db.insert("messages", {
      conversationId: conversation._id,
      senderId: me._id,
      body,
      timestamp: now,
      read: false,
      messageType: "system", // or "text" if your UI doesn't handle other types yet
    });

    await ctx.db.patch(conversation._id, {
      lastMessage: body,
      unreadCount: conversation.unreadCount + 1,
      ...(conversation.userA === buyerId
        ? { unreadCountA: (conversation.unreadCountA ?? 0) + 1 }
        : { unreadCountB: (conversation.unreadCountB ?? 0) + 1 }),
      updatedAt: now,
    });

    await notify(ctx, {
      userId: buyerId,
      type: "message",
      body,
      listingId: listing._id,
      conversationId: conversation._id,
    });

    return { conversationId: conversation._id, buyerId };
  },
});
// Send a text message. Bumps the conversation and notifies the other person.
export const send = mutation({
  args: {
    conversationId: v.optional(v.id("conversations")),
    listingId: v.optional(v.id("listings")),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const body = args.body.trim();
    if (body.length === 0) {
      throw new Error("Message cannot be empty");
    }
    if (args.conversationId !== undefined && args.listingId !== undefined) {
      throw new Error("Provide a conversation or listing, not both");
    }
    let conversation: Doc<"conversations"> | null;
    if (args.conversationId !== undefined) {
      conversation = await ctx.db.get(args.conversationId);
    } else if (args.listingId !== undefined) {
      conversation = await getOrCreateConversationForListing(
        ctx,
        me,
        args.listingId,
      );
    } else {
      throw new Error("A conversation or listing is required");
    }
    if (conversation === null) {
      throw new Error("Conversation not found");
    }
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }

    const now = Date.now();
    const recipientId =
      conversation.userA === me._id ? conversation.userB : conversation.userA;
    const messageId = await ctx.db.insert("messages", {
      conversationId: conversation._id,
      senderId: me._id,
      body,
      timestamp: now,
      read: false,
      messageType: "text",
    });

    await ctx.db.patch(conversation._id, {
      lastMessage: body,
      unreadCount: conversation.unreadCount + 1,
      ...(conversation.userA === recipientId
        ? { unreadCountA: (conversation.unreadCountA ?? 0) + 1 }
        : { unreadCountB: (conversation.unreadCountB ?? 0) + 1 }),
      updatedAt: now,
    });

    await notify(ctx, {
      userId: recipientId,
      type: "message",
      body: `${me.firstName} ${me.lastName}: ${body}`,
      listingId: conversation.listingId,
      conversationId: conversation._id,
    });

    const message = await ctx.db.get(messageId);
    if (message === null) {
      throw new Error("Could not save message");
    }
    return message;
  },
});

// Delete one of your own messages.
export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const message = await ctx.db.get(args.id);
    if (message === null) {
      throw new Error("Message not found");
    }
    if (message.senderId !== me._id) {
      throw new Error("You can only delete your own messages");
    }
    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});

// Attach an uploaded image as a message (body holds the storage id).
export const attachImage = mutation({
  args: {
    conversationId: v.id("conversations"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation === null) {
      throw new Error("Conversation not found");
    }
    if (conversation.userA !== me._id && conversation.userB !== me._id) {
      throw new Error("You are not a participant in this conversation");
    }

    const now = Date.now();
    const recipientId =
      conversation.userA === me._id ? conversation.userB : conversation.userA;
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: me._id,
      body: args.storageId,
      timestamp: now,
      read: false,
      messageType: "image",
    });

    await ctx.db.patch(args.conversationId, {
      lastMessage: "📷 Image",
      unreadCount: conversation.unreadCount + 1,
      ...(conversation.userA === recipientId
        ? { unreadCountA: (conversation.unreadCountA ?? 0) + 1 }
        : { unreadCountB: (conversation.unreadCountB ?? 0) + 1 }),
      updatedAt: now,
    });

    await notify(ctx, {
      userId: recipientId,
      type: "message",
      body: `${me.firstName} ${me.lastName} sent a photo`,
      listingId: conversation.listingId,
      conversationId: conversation._id,
    });

    return await ctx.db.get(messageId);
  },
});
