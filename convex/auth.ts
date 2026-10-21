import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      // Called on sign-up to build the matching row in the `users` table.
      // Extra fields (username, names) come from the sign-up form's params.
      profile(params) {
        const email = (params.email as string) ?? "";
        return {
          email,
          username: (params.username as string) || email.split("@")[0] || "user",
          firstName: (params.firstName as string) ?? "",
          lastName: (params.lastName as string) ?? "",
          dateJoined: Date.now(),
          bio: "",
          location: "",
          profilePicture: "",
        };
      },
    }),
  ],
});
