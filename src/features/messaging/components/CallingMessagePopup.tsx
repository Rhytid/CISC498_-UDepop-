import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { type ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { Id } from "@convex/_generated/dataModel";

export default function MessageButton({
  listingId,
  children,
  style,
}: {
  listingId: Id<"listings">;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Start a message to the seller"
      onPress={() =>
        router.push({
          pathname: "/messages",
          params: { listingId, conversationId: undefined },
        })
      }
      style={style}
    >
      {children ?? <Ionicons name="chatbubble-outline" size={40} />}
    </Pressable>
  );
}