import React, { useEffect, useRef } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import { SIDEBAR_ACCENT } from "@/components/sidebar/navigation";
import { useTheme } from "@/hooks/use-theme";
import type { Message } from "./types";
import { formatMessageTime } from "./utils";

export function MessageList({
  messages,
  currentUserId,
  loading,
  photoUrls,
}: {
  messages?: Message[] | null;
  currentUserId?: string;
  loading: boolean;
  photoUrls?: Record<string, string | null>;
}) {
  const theme = useTheme();
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (messages?.length) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages?.length]);

  if (loading) {
    return <MessageSkeletons />;
  }

  if (messages === null) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          This conversation is unavailable.
        </Text>
      </View>
    );
  }

  if (!messages?.length) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Send a message to start the conversation.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      contentContainerStyle={styles.messages}
      data={messages}
      keyExtractor={(message) => message._id}
      renderItem={({ item }) => {
        const outgoing = item.senderId === currentUserId;
        const imageUrl =
          item.messageType === "image" ? photoUrls?.[item.body] : undefined;

        return (
          <View
            style={[
              styles.messageGroup,
              outgoing ? styles.outgoingGroup : styles.incomingGroup,
            ]}
          >
            <View
              style={[
                styles.bubble,
                outgoing
                  ? { backgroundColor: SIDEBAR_ACCENT }
                  : {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.backgroundSelected,
                    },
              ]}
            >
              {item.messageType === "image" ? (
                imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    resizeMode="cover"
                    style={styles.image}
                  />
                ) : (
                  <Text
                    style={[
                      styles.body,
                      { color: outgoing ? "#FFFFFF" : theme.text },
                    ]}
                  >
                    Photo unavailable
                  </Text>
                )
              ) : (
                <Text
                  style={[
                    styles.body,
                    { color: outgoing ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {item.body}
                </Text>
              )}
            </View>
            <View style={styles.meta}>
              <Text style={[styles.time, { color: theme.textSecondary }]}>
                {formatMessageTime(item.timestamp)}
              </Text>
              {outgoing && item.read && (
                <Text style={[styles.read, { color: theme.textSecondary }]}>
                  Read
                </Text>
              )}
            </View>
          </View>
        );
      }}
      showsVerticalScrollIndicator
    />
  );
}

function MessageSkeletons() {
  const theme = useTheme();

  return (
    <View accessibilityLabel="Loading messages" style={styles.skeletons}>
      {[168, 224, 142, 196].map((width, item) => (
        <View
          key={item}
          style={[
            styles.skeletonBubble,
            item % 2 === 0 ? styles.skeletonLeft : styles.skeletonRight,
            { backgroundColor: theme.backgroundSelected },
            { width },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    minHeight: 0,
  },
  messages: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 18,
    gap: 12,
  },
  messageGroup: {
    maxWidth: "78%",
    gap: 4,
  },
  outgoingGroup: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  incomingGroup: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: 220,
    height: 180,
    borderRadius: 10,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
  },
  time: {
    fontSize: 11,
  },
  read: {
    fontSize: 11,
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  skeletons: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    padding: 20,
  },
  skeletonBubble: {
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonLeft: {
    alignSelf: "flex-start",
  },
  skeletonRight: {
    alignSelf: "flex-end",
  },
});
