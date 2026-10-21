/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";
import { asUser, seedListing, seedUser } from "./testHelpers";

const modules = import.meta.glob("./**/*.ts");

const listingInput = {
  title: "Desk Lamp",
  description: "Works great, barely used.",
  category: "Dorm",
  price: 12,
  tags: ["dorm", "lighting"],
};

describe("listings", () => {
  test("create requires authentication", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.listings.create, { ...listingInput, photos: [] }),
    ).rejects.toThrow("Not authenticated");
  });

  test("create then list (authenticated)", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const asSeller = asUser(t, sellerId);

    await asSeller.mutation(api.listings.create, {
      ...listingInput,
      photos: [],
    });

    const result = await t.query(api.listings.list, {});
    expect(result.page).toHaveLength(1);
    expect(result.page[0]).toMatchObject(listingInput);
    expect(result.page[0].sold).toBe(false);
  });

  test("get includes seller, then update, markSold, remove", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const asSeller = asUser(t, sellerId);

    const id = await asSeller.mutation(api.listings.create, {
      ...listingInput,
      photos: [],
    });

    const got = await t.query(api.listings.get, { id });
    expect(got).toMatchObject(listingInput);
    expect(got?.seller?.username).toBe("seller");

    await asSeller.mutation(api.listings.update, {
      id,
      ...listingInput,
      photos: [],
      price: 15,
    });
    expect((await t.query(api.listings.get, { id }))?.price).toBe(15);

    await asSeller.mutation(api.listings.markSold, { id, sold: true });
    expect((await t.query(api.listings.get, { id }))?.sold).toBe(true);

    // Sold listings drop out of the default list.
    expect((await t.query(api.listings.list, {})).page).toHaveLength(0);
    expect(
      (await t.query(api.listings.list, { includeSold: true })).page,
    ).toHaveLength(1);

    await asSeller.mutation(api.listings.remove, { id });
    expect(
      (await t.query(api.listings.list, { includeSold: true })).page,
    ).toHaveLength(0);
  });

  test("filters by category and price range", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const asSeller = asUser(t, sellerId);

    await asSeller.mutation(api.listings.create, {
      ...listingInput,
      photos: [],
    });
    await asSeller.mutation(api.listings.create, {
      ...listingInput,
      photos: [],
      title: "Textbook",
      category: "Books",
      price: 40,
    });

    const books = await t.query(api.listings.list, { category: "Books" });
    expect(books.page).toHaveLength(1);
    expect(books.page[0].title).toBe("Textbook");

    const cheap = await t.query(api.listings.list, { maxPrice: 20 });
    expect(cheap.page).toHaveLength(1);
    expect(cheap.page[0].title).toBe("Desk Lamp");
  });

  test("full-text search across title/description/tags", async () => {
    const t = convexTest(schema, modules);
    const sellerId = await seedUser(t, { username: "seller" });
    const asSeller = asUser(t, sellerId);

    await asSeller.mutation(api.listings.create, {
      ...listingInput,
      photos: [],
    });
    await asSeller.mutation(api.listings.create, {
      ...listingInput,
      photos: [],
      title: "Textbook",
      description: "Math 121",
    });

    const found = await t.query(api.listings.search, { query: "textbook" });
    expect(found).toHaveLength(1);
    expect(found[0].title).toBe("Textbook");
  });

  test("only the owner can edit or delete", async () => {
    const t = convexTest(schema, modules);
    const owner = await seedUser(t, { username: "owner" });
    const listingId = await seedListing(t, owner, listingInput);
    const otherId = await seedUser(t, { username: "other" });
    const asOther = asUser(t, otherId);

    await expect(
      asOther.mutation(api.listings.remove, { id: listingId }),
    ).rejects.toThrow("own listings");
    await expect(
      asOther.mutation(api.listings.update, {
        id: listingId,
        ...listingInput,
        photos: [],
      }),
    ).rejects.toThrow("own listings");
  });
});
