/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest, type TestConvex } from "convex-test";
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

async function messageSeller(t: TestConvex<typeof schema>) {
  const seller = await seedUser(t, { username: "seller" });
  const listingId = await seedListing(t, seller, listingInput);
  const buyerId = await seedUser(t, { username: "buyer" });
  const asBuyer = asUser(t, buyerId);
  const conversationId = await asBuyer.mutation(api.conversations.start, {
    listingId,
  });
  await asBuyer.mutation(api.messages.send, {
    conversationId,
    body: "hello",
  });
  return { seller, buyerId, conversationId };
}

describe("notifications", () => {
  test("list, unreadCount, and markRead", async () => {
    const t = convexTest(schema, modules);
    const { seller } = await messageSeller(t);

    const asSeller = asUser(t, seller);
    expect(await asSeller.query(api.notifications.unreadCount)).toBe(1);

    const list = await asSeller.query(api.notifications.list);
    expect(list).toHaveLength(1);
    expect(list?.[0]?.read).toBe(false);

    const id = list![0]._id;
    await asSeller.mutation(api.notifications.markRead, { id });
    expect(await asSeller.query(api.notifications.unreadCount)).toBe(0);
    expect((await asSeller.query(api.notifications.list))?.[0]?.read).toBe(true);
  });

  test("markAllRead clears every unread notification", async () => {
    const t = convexTest(schema, modules);
    const { seller, buyerId, conversationId } = await messageSeller(t);
    const asBuyer = asUser(t, buyerId);
    await asBuyer.mutation(api.messages.send, {
      conversationId,
      body: "again",
    });

    const asSeller = asUser(t, seller);
    expect(await asSeller.query(api.notifications.unreadCount)).toBe(2);

    await asSeller.mutation(api.notifications.markAllRead);
    expect(await asSeller.query(api.notifications.unreadCount)).toBe(0);
  });

  test("cannot mark another user's notification as read", async () => {
    const t = convexTest(schema, modules);
    const { seller, buyerId } = await messageSeller(t);

    const asSeller = asUser(t, seller);
    const list = await asSeller.query(api.notifications.list);
    const id = list![0]._id;

    const asBuyer = asUser(t, buyerId);
    await expect(
      asBuyer.mutation(api.notifications.markRead, { id }),
    ).rejects.toThrow("does not belong to you");
  });
});
