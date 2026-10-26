import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function MessagePopup() {
  const raw = useLocalSearchParams<{ conversationId?: string | string[] }>()
    .conversationId;
  const param = Array.isArray(raw) ? raw[0] : raw;
  const conversationId =
    param && param !== "undefined" ? (param as Id<"conversations">) : undefined;

  const convo = useQuery(
    api.conversations.get,
    conversationId ? { id: conversationId } : "skip",
  );
  const messages = useQuery(
    api.messages.list,
    conversationId ? { conversationId } : "skip",
  );
  const send = useMutation(api.messages.send);
  const markRead = useMutation(api.conversations.markRead);

  const [text, setText] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const otherId = convo?.otherUser?._id;

  // Scroll to newest message
  useEffect(() => {
    if (messages && messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages?.length]);

  // Mark the other person's messages as read while the popup is open
  const hasUnread =
    !!messages &&
    !!otherId &&
    messages.some((m) => m.senderId === otherId && !m.read);
  useEffect(() => {
    if (conversationId && hasUnread) {
      markRead({ id: conversationId }).catch(() => {});
    }
  }, [conversationId, hasUnread, markRead]);

  if (!conversationId) {
    return <Text style={{ padding: 20 }}>No conversation selected.</Text>;
  }
  if (convo === undefined || messages === undefined) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }
  if (convo === null || messages === null) {
    return <Text style={{ padding: 20 }}>Conversation not available.</Text>;
  }

  const onSend = async () => {
    const body = text.trim();
    if (!body) return;
    setText("");
    setSendError(null);
    try {
      await send({ conversationId, body });
    } catch (e) {
      setText(body); // restore so the text isn't lost
      setSendError((e as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Header */}
      <View
        style={{ paddingBottom: 12, borderBottomWidth: 1, borderColor: "#ddd" }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {convo.listing?.title ?? "Listing"}
          {convo.listing ? ` · $${convo.listing.price}` : ""}
        </Text>
        <Text>
          With{" "}
          {convo.otherUser
            ? `${convo.otherUser.firstName} ${convo.otherUser.lastName} (@${convo.otherUser.username})`
            : "Unknown user"}
        </Text>
      </View>

      {/* Thread */}
      <FlatList
        ref={listRef}
        style={{ flex: 1 }}
        data={messages}
        keyExtractor={(m) => m._id}
        ListEmptyComponent={
          <Text style={{ paddingVertical: 12 }}>No messages yet. Say hi!</Text>
        }
        renderItem={({ item }) => {
          const theirs = item.senderId === otherId;
          return (
            <View
              style={{
                alignSelf: theirs ? "flex-start" : "flex-end",
                backgroundColor: theirs ? "#e5e7eb" : "#2563eb",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginVertical: 4,
                maxWidth: "80%",
              }}
            >
              <Text style={{ color: theirs ? "black" : "white" }}>
                {item.messageType === "image" ? "📷 Image" : item.body}
              </Text>
            </View>
          );
        }}
      />

      {sendError && <Text style={{ color: "red" }}>{sendError}</Text>}

      {/* Composer */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          paddingTop: 8,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 8,
          }}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <Pressable onPress={onSend}>
          <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
