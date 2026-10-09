/// <reference types="vite/client" />
import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";
import { asUser, seedUser } from "./testHelpers";

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
});
