import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireUser } from "./lib";

// Current user's notifications, newest first (null when not authenticated).
export const list = query({
  args: {},
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    if (me === null) {
      return null;
    }
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", me._id))
      .order("desc")
      .collect();
  },
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const me = await requireUser(ctx);
    const notification = await ctx.db.get(args.id);
    if (notification === null) {
      throw new Error("Notification not found");
    }
    if (notification.userId !== me._id) {
      throw new Error("This notification does not belong to you");
    }
    await ctx.db.patch(args.id, { read: true });
    return await ctx.db.get(args.id);
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const me = await requireUser(ctx);
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", me._id))
      .collect();

    let marked = 0;
    for (const notification of notifications) {
      if (!notification.read) {
        await ctx.db.patch(notification._id, { read: true });
        marked += 1;
      }
    }
    return { marked };
  },
});

// Number of unread notifications for the current user.
export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    if (me === null) {
      return 0;
    }
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", me._id))
      .collect();
    return notifications.filter((n) => !n.read).length;
  },
});
