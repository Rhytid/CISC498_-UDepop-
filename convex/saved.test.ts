/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";
import { asUser, seedListing, seedUser } from "./testHelpers";

const modules = import.meta.glob("./**/*.ts");

describe("saved", () => {
  test("add, isSaved, list, remove", async () => {
    const t = convexTest(schema, modules);
    const owner = await seedUser(t, { username: "owner" });
    const listingId = await seedListing(t, owner, {
      title: "Lamp",
      description: "Bright",
      category: "Dorm",
      price: 10,
      tags: [],
    });
    const saverId = await seedUser(t, { username: "saver" });
    const asSaver = asUser(t, saverId);

    expect(await asSaver.query(api.saved.isSaved, { listingId })).toBe(false);

    await asSaver.mutation(api.saved.add, { listingId });
    expect(await asSaver.query(api.saved.isSaved, { listingId })).toBe(true);

    // Saving twice is idempotent (still one row).
    await asSaver.mutation(api.saved.add, { listingId });
    const list = await asSaver.query(api.saved.list);
    expect(list).toHaveLength(1);
    expect(list?.[0].listing.title).toBe("Lamp");

    await asSaver.mutation(api.saved.remove, { listingId });
    expect(await asSaver.query(api.saved.isSaved, { listingId })).toBe(false);
    expect(await asSaver.query(api.saved.list)).toHaveLength(0);
  });

  test("isSaved returns false when unauthenticated", async () => {
    const t = convexTest(schema, modules);
    const owner = await seedUser(t, { username: "owner" });
    const listingId = await seedListing(t, owner, {
      title: "Lamp",
      description: "Bright",
      category: "Dorm",
      price: 10,
      tags: [],
    });
    expect(await t.query(api.saved.isSaved, { listingId })).toBe(false);
  });
});
