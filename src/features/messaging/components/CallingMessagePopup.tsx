import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export default function MessageButton({
  listingId,
}: {
  listingId: Id<"listings">;
}) {
  const startConvo = useMutation(api.conversations.startItemConvo);
  const [starting, setStarting] = useState(false);

  const onPress = async () => {
    if (!listingId || starting) {
      return;
    }
    setStarting(true);
    try {
      const conversationId = await startConvo({ listingId });
      router.push({
        pathname: "/messages",
        params: { conversationId },
      });
    } catch (e) {
      console.warn(e instanceof Error ? e.message : String(e));
    } finally {
      setStarting(false);
    }
  };

  return (
    <Pressable onPress={onPress} disabled={starting}>
      <Ionicons name="chatbubble-outline" size={40} />
    </Pressable>
  );
}