/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";
import { asUser, seedListing, seedUser } from "./testHelpers";

const modules = import.meta.glob("./**/*.ts");

describe("photos", () => {
  test("generateUploadUrl requires authentication", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.photos.generateUploadUrl)).rejects.toThrow(
      "Not authenticated",
    );
  });

  test("attach and removePhoto", async () => {
    const t = convexTest(schema, modules);
    const owner = await seedUser(t, { username: "owner" });
    const listingId = await seedListing(t, owner, {
      title: "Lamp",
      description: "Bright",
      category: "Dorm",
      price: 10,
      tags: [],
    });
    const asOwner = asUser(t, owner);

    const uploadUrl = await asOwner.mutation(api.photos.generateUploadUrl);
    expect(typeof uploadUrl).toBe("string");

    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(["img"]));
    });

    const attached = await asOwner.mutation(api.photos.attach, {
      listingId,
      storageId,
    });
    expect(attached?.photos).toHaveLength(1);

    const removed = await asOwner.mutation(api.photos.removePhoto, {
      listingId,
      storageId,
    });
    expect(removed?.photos).toHaveLength(0);
  });
});
