import type { TestConvex } from "convex-test";
import type { Id } from "./_generated/dataModel";
import schema from "./schema";

type T = TestConvex<typeof schema>;

// Seed helpers used across the convex/*.test.ts suites. They write documents
// directly (bypassing auth) so tests can set up fixtures for any user.

export async function seedUser(
  t: T,
  opts: {
    username: string;
    firstName?: string;
    lastName?: string;
  },
): Promise<Id<"users">> {
  return await t.mutation(async (ctx) => {
    return await ctx.db.insert("users", {
      email: `${opts.username}@example.com`,
      username: opts.username,
      firstName: opts.firstName ?? "First",
      lastName: opts.lastName ?? "Last",
      dateJoined: Date.now(),
      bio: "",
      location: "",
      profilePicture: "",
    });
  });
}

// Returns a test accessor that acts as the given user (via the auth `subject`).
export function asUser(t: T, userId: Id<"users">) {
  return t.withIdentity({ subject: userId });
}

export async function seedListing(
  t: T,
  ownerId: Id<"users">,
  input: {
    title: string;
    description: string;
    category: string;
    price: number;
    tags: string[];
  },
): Promise<Id<"listings">> {
  return await t.mutation(async (ctx) => {
    return await ctx.db.insert("listings", {
      ownerId,
      title: input.title,
      description: input.description,
      category: input.category,
      price: input.price,
      tags: input.tags,
      photos: [],
      searchText: [input.title, input.description, ...input.tags]
        .join(" ")
        .toLowerCase(),
      sold: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
}
