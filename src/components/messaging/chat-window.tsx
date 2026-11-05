import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { ChatHeader } from "./chat-header";
import { MessageComposer } from "./message-composer";
import { MessageList } from "./message-list";
import type { Conversation, Message } from "./types";

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  isSeller,
  loading,
  sending,
  error,
  photoUrls,
  onSend,
  onBack,
}: {
  conversation: Conversation;
  messages?: Message[] | null;
  currentUserId?: string;
  isSeller?: boolean;
  loading: boolean;
  sending: boolean;
  error?: string | null;
  photoUrls?: Record<string, string | null>;
  onSend: (body: string) => Promise<boolean>;
  onBack?: () => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
      ]}
    >
      <ChatHeader
        conversation={conversation}
        isSeller={isSeller}
        photoUrls={photoUrls}
        onBack={onBack}
      />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        loading={loading}
        photoUrls={photoUrls}
      />
      {error && (
        <Text
          accessibilityRole="alert"
          style={[styles.error, { color: theme.text }]}
        >
          {error}
        </Text>
      )}
      <MessageComposer
        disabled={messages === null || messages === undefined}
        sending={sending}
        onSend={onSend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  error: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    fontSize: 13,
  },
});
