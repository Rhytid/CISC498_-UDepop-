import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import React, { useState, type ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export default function MessageButton({
  listingId,
  children,
  style,
  onError,
}: {
  listingId: Id<"listings">;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  onError?: (error: unknown) => void;
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
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.warn(error instanceof Error ? error.message : String(error));
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Message seller"
      onPress={onPress}
      disabled={starting}
      style={style}
    >
      {children ?? <Ionicons name="chatbubble-outline" size={40} />}
    </Pressable>
  );
}