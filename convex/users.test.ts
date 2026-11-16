/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";
import { asUser, seedListing, seedUser } from "./testHelpers";

const modules = import.meta.glob("./**/*.ts");

describe("users", () => {
  test("getMe returns null when unauthenticated", async () => {
    const t = convexTest(schema, modules);
    expect(await t.query(api.users.getMe)).toBeNull();
  });

  test("getMe, getByUsername, getById, updateProfile", async () => {
    const t = convexTest(schema, modules);
    const id = await seedUser(t, { username: "alice", firstName: "Alice" });
    const asAlice = asUser(t, id);

    const me = await asAlice.query(api.users.getMe);
    expect(me).not.toBeNull();
    expect(me?.username).toBe("alice");

    expect(
      await t.query(api.users.getByUsername, { username: "alice" }),
    ).not.toBeNull();
    expect(await t.query(api.users.getById, { userId: id })).not.toBeNull();

    await asAlice.mutation(api.users.updateProfile, {
      bio: "hi",
      location: "Kingston",
    });
    const updated = await asAlice.query(api.users.getMe);
    expect(updated?.bio).toBe("hi");
    expect(updated?.location).toBe("Kingston");
  });

  test("updateProfile enforces unique usernames", async () => {
    const t = convexTest(schema, modules);
    const aliceId = await seedUser(t, { username: "alice" });
    await seedUser(t, { username: "bob" });
    const asAlice = asUser(t, aliceId);

    await expect(
      asAlice.mutation(api.users.updateProfile, { username: "bob" }),
    ).rejects.toThrow("taken");
  });

  test("search finds people by username or name", async () => {
    const t = convexTest(schema, modules);
    await seedUser(t, { username: "alice", firstName: "Alice" });
    await seedUser(t, { username: "bob", firstName: "Bob" });

    const byUsername = await t.query(api.users.search, { query: "alice" });
    expect(byUsername).toHaveLength(1);
    expect(byUsername[0].username).toBe("alice");

    const byName = await t.query(api.users.search, { query: "Bob" });
    expect(byName).toHaveLength(1);
    expect(byName[0].username).toBe("bob");
  });

  test("listAll defaults to username order and accepts sorting options", async () => {
    const t = convexTest(schema, modules);
    const zed = await seedUser(t, { username: "zed" });
    const alice = await seedUser(t, { username: "alice" });
    const reviewer = await seedUser(t, { username: "reviewer" });
    await seedListing(t, alice, {
      title: "Lamp",
      description: "",
      category: "Dorm",
      price: 10,
      tags: [],
    });
    await seedListing(t, alice, {
      title: "Desk",
      description: "",
      category: "Dorm",
      price: 20,
      tags: [],
    });
    const zedListing = await seedListing(t, zed, {
      title: "Book",
      description: "",
      category: "Books",
      price: 5,
      tags: [],
    });
    await t.mutation(async (ctx) => {
      await ctx.db.insert("reviews", {
        raterId: reviewer,
        rateeId: zed,
        listingId: zedListing,
        score: 5,
        comment: "",
        createdAt: Date.now(),
      });
    });

    const paginationOpts = { numItems: 20, cursor: null };
    const defaultSort = await t.query(api.users.listAll, { paginationOpts });
    expect(defaultSort.page.map((user) => user.username)).toEqual([
      "alice",
      "reviewer",
      "zed",
    ]);

    const byListings = await t.query(api.users.listAll, {
      paginationOpts,
      sortBy: "listings",
    });
    expect(byListings.page.map((user) => user.username)).toEqual([
      "alice",
      "zed",
      "reviewer",
    ]);

    const byReviews = await t.query(api.users.listAll, {
      paginationOpts,
      sortBy: "reviews",
    });
    expect(byReviews.page[0].username).toBe("zed");
  });
});
