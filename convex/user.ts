import { v } from "convex/values";

// need 3rd party password making eventually
const userFields = {
  userId: v.string(),
  email: v.string(),

  username: v.string(),
  firstName: v.string(),
  lastName: v.string(),

  dateJoined: v.number(),
  bio: v.string(),
  location: v.string(),
  profilePicture: v.string(),
};
