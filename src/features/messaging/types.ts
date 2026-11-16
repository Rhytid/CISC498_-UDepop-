import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";

export type Conversation = NonNullable<
  FunctionReturnType<typeof api.conversations.list>
>[number];

export type ConversationContext = Pick<Conversation, "listing" | "otherUser">;

export type Message = NonNullable<
  FunctionReturnType<typeof api.messages.list>
>[number];
