import { mutation, query } from "../_generated/server";

export const createListing = mutation(
  async ({ db }, { title, price, description, tags }) => {
    return await db.insert("listings", {
      title,
      price,
      description,
      tags,
    });
  },
);

export const getListings = query(async ({ db }) => {
  return await db.query("listings").collect();
});
