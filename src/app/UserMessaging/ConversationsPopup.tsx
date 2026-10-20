import { useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function ConversationsPopup() {
  const conversations = useQuery(api.conversations.list, {});

  if (conversations === undefined) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }
  if (conversations === null) {
    return (
      <Text style={{ padding: 20 }}>Please sign in to see your messages.</Text>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, paddingBottom: 12 }}>
        My messages
      </Text>

      <FlatList
        data={conversations}
        keyExtractor={(c) => c._id}
        ListEmptyComponent={<Text>No conversations yet.</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/UserMessaging/MessagePopup",
                params: { conversationId: item._id },
              })
            }
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.otherUser
                ? `${item.otherUser.firstName} ${item.otherUser.lastName}`
                : "Unknown user"}
              {item.unreadCount > 0 ? `  (${item.unreadCount} new)` : ""}
            </Text>
            <Text style={{ color: "#555" }}>
              {item.listing?.title ?? "Listing removed"}
            </Text>
            <Text numberOfLines={1} style={{ color: "#888" }}>
              {item.lastMessage || "No messages yet"}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
