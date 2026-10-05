import { ConvexReactClient } from "convex/react";

// The backend URL the app connects to. On web and native alike, the Convex
// client talks to this deployment directly — no REST layer needed.
//
// Local:  set in .env.local (http://127.0.0.1:3210 while `npx convex dev` runs)
// Cloud:  change EXPO_PUBLIC_CONVEX_URL to https://<project>.convex.cloud
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;

export const convex = new ConvexReactClient(convexUrl);
