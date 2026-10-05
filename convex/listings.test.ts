/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

const listing = {
  title: "Desk Lamp",
  price: 12,
  description: "Works great, barely used.",
  tags: ["dorm", "lighting"],
};

describe("listings functions", () => {
  test("create then list", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.listings.create, listing);

    const listings = await t.query(api.listings.list);
    expect(listings).toHaveLength(1);
    expect(listings[0]).toMatchObject(listing);
  });

  test("get by id, update, and remove", async () => {
    const t = convexTest(schema, modules);

    const id = await t.mutation(api.listings.create, listing);
    expect(await t.query(api.listings.get, { id })).toMatchObject(listing);

    await t.mutation(api.listings.update, { id, ...listing, price: 15 });
    expect(await t.query(api.listings.get, { id })).toMatchObject({
      ...listing,
      price: 15,
    });

    await t.mutation(api.listings.remove, { id });
    expect(await t.query(api.listings.list)).toHaveLength(0);
  });
});

describe("listings HTTP routes", () => {
  test("POST /listings, GET /listings, GET /listings/:id", async () => {
    const t = convexTest(schema, modules);

    const created = await t.fetch("/listings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(listing),
    });
    expect(created.status).toBe(201);
    const { id } = await created.json();

    const all = await t.fetch("/listings");
    expect(all.status).toBe(200);
    const list = await all.json();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject(listing);

    const one = await t.fetch(`/listings/${id}`);
    expect(one.status).toBe(200);
    expect(await one.json()).toMatchObject(listing);
  });
});
