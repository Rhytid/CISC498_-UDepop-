import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

export type User = Doc<"users">;

// Resolves the user document for the current Convex Auth session.
// Returns null when the request is unauthenticated (or no user exists yet).
export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx,
): Promise<User | null> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
}

// Like getCurrentUser but throws for unauthenticated requests.
// Used by every mutation (and query) that requires a logged-in user.
export async function requireUser(
  ctx: QueryCtx | MutationCtx,
): Promise<User> {
  const user = await getCurrentUser(ctx);
  if (user === null) {
    throw new Error("Not authenticated");
  }
  return user;
}

// Canonical ordering of a conversation's two participants so that the
// "same" pair of users always produces the same (userA, userB).
export function orderPair<T extends string>(
  a: T,
  b: T,
): { userA: T; userB: T } {
  return a < b ? { userA: a, userB: b } : { userA: b, userB: a };
}

// Inserts an in-app notification for a user. Called from other mutations
// (messages.send, reviews.create, listings.markSold).
export async function notify(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    type: "message" | "review" | "sold";
    body: string;
    listingId?: Id<"listings">;
    conversationId?: Id<"conversations">;
  },
) {
  await ctx.db.insert("notifications", {
    userId: args.userId,
    type: args.type,
    body: args.body,
    listingId: args.listingId,
    conversationId: args.conversationId,
    read: false,
    createdAt: Date.now(),
  });
}
