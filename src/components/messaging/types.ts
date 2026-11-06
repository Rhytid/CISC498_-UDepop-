import type { FunctionReturnType } from "convex/server";

import { api } from "../../../convex/_generated/api";

export type Conversation = NonNullable<
  FunctionReturnType<typeof api.conversations.list>
>[number];

export type Message = NonNullable<
  FunctionReturnType<typeof api.messages.list>
>[number];
