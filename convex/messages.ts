import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, notify, requireUser } from "./lib";

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
    if (
      conversation.userA !== me._id &&
      conversation.userB !== me._id
    ) {
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

// Send a text message. Bumps the conversation and notifies the other person.
export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation === null) {
      throw new Error("Conversation not found");
    }
    if (
      conversation.userA !== me._id &&
      conversation.userB !== me._id
    ) {
      throw new Error("You are not a participant in this conversation");
    }

    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: me._id,
      body: args.body,
      timestamp: now,
      read: false,
      messageType: "text",
    });

    await ctx.db.patch(args.conversationId, {
      lastMessage: args.body,
      unreadCount: conversation.unreadCount + 1,
      updatedAt: now,
    });

    const otherId =
      conversation.userA === me._id ? conversation.userB : conversation.userA;
    await notify(ctx, {
      userId: otherId,
      type: "message",
      body: `${me.firstName} ${me.lastName}: ${args.body}`,
      listingId: conversation.listingId,
      conversationId: conversation._id,
    });

    return await ctx.db.get(messageId);
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
    if (
      conversation.userA !== me._id &&
      conversation.userB !== me._id
    ) {
      throw new Error("You are not a participant in this conversation");
    }

    const now = Date.now();
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
      updatedAt: now,
    });

    const otherId =
      conversation.userA === me._id ? conversation.userB : conversation.userA;
    await notify(ctx, {
      userId: otherId,
      type: "message",
      body: `${me.firstName} ${me.lastName} sent a photo`,
      listingId: conversation.listingId,
      conversationId: conversation._id,
    });

    return await ctx.db.get(messageId);
  },
});
