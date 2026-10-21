/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";
import { asUser, seedListing, seedUser } from "./testHelpers";

const modules = import.meta.glob("./**/*.ts");

const listingInput = {
  title: "Lamp",
  description: "Bright",
  category: "Dorm",
  price: 10,
  tags: [],
};

describe("conversations", () => {
  test("start is idempotent per (listing, buyer, seller)", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, sellerId, listingInput);
    const buyerId = await seedUser(t, { username: "buyer" });
    const asBuyer = asUser(t, buyerId);

    const first = await asBuyer.mutation(api.conversations.start, {
      listingId,
    });
    const second = await asBuyer.mutation(api.conversations.start, {
      listingId,
    });
    expect(second).toBe(first);
  });

  test("cannot message yourself about your own listing", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, sellerId, listingInput);
    const asSeller = asUser(t, sellerId);

    await expect(
      asSeller.mutation(api.conversations.start, { listingId }),
    ).rejects.toThrow("yourself");
  });

  test("list and get join in the other user and listing", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, sellerId, listingInput);
    const buyerId = await seedUser(t, { username: "buyer" });
    const asBuyer = asUser(t, buyerId);
    const id = await asBuyer.mutation(api.conversations.start, { listingId });

    const list = await asBuyer.query(api.conversations.list);
    expect(list).toHaveLength(1);
    expect(list?.[0].otherUser?.username).toBe("seller");

    const got = await asBuyer.query(api.conversations.get, { id });
    expect(got?.otherUser?.username).toBe("seller");
    expect(got?.listing?.title).toBe("Lamp");
  });

  test("archive and unarchive", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, sellerId, listingInput);
    const buyerId = await seedUser(t, { username: "buyer" });
    const asBuyer = asUser(t, buyerId);
    const id = await asBuyer.mutation(api.conversations.start, { listingId });

    await asBuyer.mutation(api.conversations.archive, { id });
    expect((await asBuyer.query(api.conversations.get, { id }))?.archived).toBe(
      true,
    );
    await asBuyer.mutation(api.conversations.unarchive, { id });
    expect((await asBuyer.query(api.conversations.get, { id }))?.archived).toBe(
      false,
    );
  });
});
