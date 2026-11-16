import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

export default function MessagePopup() {
  const raw = useLocalSearchParams<{ conversationId?: string | string[] }>()
    .conversationId;
  const param = Array.isArray(raw) ? raw[0] : raw;
  const conversationId = param && param !== "undefined" ? param : undefined;

  return (
    <Redirect
      href={{
        pathname: "/messages", // must match your messages route
        params: conversationId ? { conversationId } : {},
      }}
    />
  );
}
