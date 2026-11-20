// Convex-derived conversation and message types shared across messaging UI.
// Keeps component contracts consistent with the backend query results.
import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";

export type Conversation = NonNullable<
  FunctionReturnType<typeof api.conversations.list>
>[number];

export type ConversationContext = Pick<Conversation, "listing" | "otherUser">;

export type Message = NonNullable<
  FunctionReturnType<typeof api.messages.list>
>[number];
