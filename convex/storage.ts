// server/queries/storage.ts
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, { storageIds }) => {
    const results = await Promise.all(
      storageIds.map(async (id) => {
        try {
          // ctx.storage.getUrl is the Convex server API to get a signed URL
          const url = await ctx.storage.getUrl(id);
          return { id, url };
        } catch (e) {
          return { id, url: null };
        }
      }),
    );
    // return an object map for easier client lookup
    const map: Record<string, string | null> = {};
    for (const r of results) map[r.id] = r.url;
    return map;
  },
});
