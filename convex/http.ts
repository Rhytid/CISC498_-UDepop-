import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const http = httpRouter();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}

/** Extract the part of the URL path after a prefix (e.g. the id in /listings/:id). */
function pathSuffix(request: Request, prefix: string): string {
  return decodeURIComponent(new URL(request.url).pathname.slice(prefix.length));
}

const LISTINGS = "/listings/";

// POST /listings
http.route({
  path: "/listings",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const id = await ctx.runMutation(api.listings.create, await request.json());
    return json({ id }, 201);
  }),
});

// GET /listings
http.route({
  path: "/listings",
  method: "GET",
  handler: httpAction(async (ctx) => {
    return json(await ctx.runQuery(api.listings.list));
  }),
});

// GET /listings/:id
http.route({
  pathPrefix: LISTINGS,
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const id = pathSuffix(request, LISTINGS) as Id<"listings">;
    const listing = await ctx.runQuery(api.listings.get, { id });
    return listing === null ? json({ error: "Listing not found" }, 404) : json(listing);
  }),
});

// PUT /listings/:id
http.route({
  pathPrefix: LISTINGS,
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    const id = pathSuffix(request, LISTINGS) as Id<"listings">;
    await ctx.runMutation(api.listings.update, { id, ...(await request.json()) });
    return json(await ctx.runQuery(api.listings.get, { id }));
  }),
});

// DELETE /listings/:id
http.route({
  pathPrefix: LISTINGS,
  method: "DELETE",
  handler: httpAction(async (ctx, request) => {
    const id = pathSuffix(request, LISTINGS) as Id<"listings">;
    await ctx.runMutation(api.listings.remove, { id });
    return json({ deleted: true });
  }),
});

// CORS preflight for the listings routes
const corsPreflight = httpAction(async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
      "access-control-allow-headers": "content-type,authorization",
    },
  });
});

http.route({ path: "/listings", method: "OPTIONS", handler: corsPreflight });
http.route({ pathPrefix: LISTINGS, method: "OPTIONS", handler: corsPreflight });

export default http;
