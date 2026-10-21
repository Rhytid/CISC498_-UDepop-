import { httpRouter } from "convex/server";
import { auth } from "./auth";

// Serves the /.well-known/jwks.json and openid-configuration endpoints that
// Convex uses to verify the session tokens issued by Convex Auth.
const http = httpRouter();
auth.addHttpRoutes(http);

export default http;
