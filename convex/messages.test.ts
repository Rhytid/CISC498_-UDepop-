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

async function setup(t: TestConvex<typeof schema>) {
  const seller = await seedUser(t, {
    username: "seller",
    firstName: "Sally",
  });
  const listingId = await seedListing(t, seller, listingInput);
  const buyerId = await seedUser(t, { username: "buyer", firstName: "Bob" });
  const asBuyer = asUser(t, buyerId);
  const conversationId = await asBuyer.mutation(api.conversations.start, {
    listingId,
  });
  return { seller, listingId, asBuyer, conversationId };
}

describe("messages", () => {
  test("send delivers a message and notifies the other user", async () => {
    const t = convexTest(schema, modules);
    const { seller, asBuyer, conversationId } = await setup(t);

    const message = await asBuyer.mutation(api.messages.send, {
      conversationId,
      body: "Hi!",
    });
    expect(message?.body).toBe("Hi!");
    expect(message?.messageType).toBe("text");

    const messages = await asBuyer.query(api.messages.list, { conversationId });
    expect(messages).toHaveLength(1);

    const asSeller = asUser(t, seller);
    const notifications = await asSeller.query(api.notifications.list);
    expect(notifications).toHaveLength(1);
    expect(notifications?.[0]?.type).toBe("message");
  });

  test("markRead clears unread count and read flags", async () => {
    const t = convexTest(schema, modules);
    const { seller, asBuyer, conversationId } = await setup(t);

    await asBuyer.mutation(api.messages.send, {
      conversationId,
      body: "one",
    });
    await asBuyer.mutation(api.messages.send, {
      conversationId,
      body: "two",
    });

    const asSeller = asUser(t, seller);
    await asSeller.mutation(api.conversations.markRead, { id: conversationId });

    const conversation = await asSeller.query(api.conversations.get, {
      id: conversationId,
    });
    expect(conversation?.unreadCount).toBe(0);

    const messages = await asSeller.query(api.messages.list, { conversationId });
    expect(messages).toHaveLength(2);
    for (const message of messages ?? []) {
      expect(message.read).toBe(true);
    }
  });

  test("non-participants cannot read or send", async () => {
    const t = convexTest(schema, modules);
    const { conversationId } = await setup(t);
    const outsiderId = await seedUser(t, { username: "outsider" });
    const asOutsider = asUser(t, outsiderId);

    await expect(
      asOutsider.query(api.messages.list, { conversationId }),
    ).rejects.toThrow("participant");
    await expect(
      asOutsider.mutation(api.messages.send, {
        conversationId,
        body: "sneaky",
      }),
    ).rejects.toThrow("participant");
  });

  test("you can only delete your own messages", async () => {
    const t = convexTest(schema, modules);
    const { seller, asBuyer, conversationId } = await setup(t);

    const message = await asBuyer.mutation(api.messages.send, {
      conversationId,
      body: "mine",
    });
    if (message === null) {
      throw new Error("expected message");
    }

    const asSeller = asUser(t, seller);
    await expect(
      asSeller.mutation(api.messages.remove, { id: message._id }),
    ).rejects.toThrow("own messages");

    await asBuyer.mutation(api.messages.remove, { id: message._id });
    expect(await asBuyer.query(api.messages.list, { conversationId })).toHaveLength(
      0,
    );
  });
});
