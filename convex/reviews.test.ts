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

describe("reviews", () => {
  test("create a review, list it, and aggregate the rating", async () => {
    const t = convexTest(schema, modules);
    const seller = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, seller, listingInput);
    const buyerId = await seedUser(t, { username: "buyer", firstName: "Bob" });
    const asBuyer = asUser(t, buyerId);

    const review = await asBuyer.mutation(api.reviews.create, {
      listingId,
      score: 5,
      comment: "Great!",
    });
    expect(review?.score).toBe(5);
    expect(review?.comment).toBe("Great!");

    expect(await t.query(api.reviews.getRating, { userId: seller })).toEqual({
      average: 5,
      count: 1,
    });

    const aboutSeller = await t.query(api.reviews.listByUser, {
      userId: seller,
    });
    expect(aboutSeller).toHaveLength(1);
    expect(aboutSeller[0].rater?.username).toBe("buyer");

    const mine = await asBuyer.query(api.reviews.listByMe);
    expect(mine).toHaveLength(1);
  });

  test("a review notifies the person being reviewed", async () => {
    const t = convexTest(schema, modules);
    const seller = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, seller, listingInput);
    const buyerId = await seedUser(t, { username: "buyer" });
    const asBuyer = asUser(t, buyerId);

    await asBuyer.mutation(api.reviews.create, { listingId, score: 4 });

    const asSeller = asUser(t, seller);
    const notifications = await asSeller.query(api.notifications.list);
    expect(notifications).toHaveLength(1);
    expect(notifications?.[0]?.type).toBe("review");
  });

  test("cannot review yourself or the same listing twice", async () => {
    const t = convexTest(schema, modules);
    const seller = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, seller, listingInput);

    const asSeller = asUser(t, seller);
    await expect(
      asSeller.mutation(api.reviews.create, { listingId, score: 5 }),
    ).rejects.toThrow("yourself");

    const buyerId = await seedUser(t, { username: "buyer" });
    const asBuyer = asUser(t, buyerId);
    await asBuyer.mutation(api.reviews.create, { listingId, score: 4 });
    await expect(
      asBuyer.mutation(api.reviews.create, { listingId, score: 5 }),
    ).rejects.toThrow("already reviewed");
  });

  test("score must be between 1 and 5", async () => {
    const t = convexTest(schema, modules);
    const seller = await seedUser(t, { username: "seller" });
    const listingId = await seedListing(t, seller, listingInput);
    const buyerId = await seedUser(t, { username: "buyer" });
    const asBuyer = asUser(t, buyerId);

    await expect(
      asBuyer.mutation(api.reviews.create, { listingId, score: 9 }),
    ).rejects.toThrow("between 1 and 5");
  });
});
