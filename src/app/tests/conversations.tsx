import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useConvex, useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function ConversationsTest() {
  const convex = useConvex();
  const conversations = useQuery(api.conversations.list);
  const start = useMutation(api.conversations.start);
  const markRead = useMutation(api.conversations.markRead);
  const archive = useMutation(api.conversations.archive);
  const unarchive = useMutation(api.conversations.unarchive);

  const [listingId, setListingId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [result, setResult] = useState("");

  const doStart = async () => {
    if (!listingId) return;
    try {
      const id = await start({ listingId: listingId as Id<"listings"> });
      setResult(`Conversation id: ${id}`);
    } catch (e) {
      setResult(String(e));
    }
  };

  const doGet = async () => {
    if (!convex || !conversationId) return;
    const doc = await convex.query(api.conversations.get, {
      id: conversationId as Id<"conversations">,
    });
    setResult(doc === null ? "Not found" : JSON.stringify(doc, null, 2));
  };

  const doAction = async (fn: (id: Id<"conversations">) => Promise<unknown>) => {
    if (!conversationId) return;
    try {
      const res = await fn(conversationId as Id<"conversations">);
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult(String(e));
    }
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>My conversations</Section>
      {conversations === undefined ? (
        <Text>Loading…</Text>
      ) : conversations === null ? (
        <Text>Not authenticated</Text>
      ) : (
        conversations.map((c) => (
          <View key={c._id} style={styles.row}>
            <Text style={styles.rowTitle}>
              with {c.otherUser?.username ?? "?"} re: {c.listing?.title ?? "?"}
            </Text>
            <Text style={styles.rowSub}>
              {c.lastMessage || "(no messages)"} · unread {c.unreadCount}
            </Text>
          </View>
        ))
      )}

      <Section>Start (by listing id)</Section>
      <Field label="Listing id" value={listingId} onChangeText={setListingId} />
      <Button label="Start conversation" onPress={doStart} />

      <Section>Get / act by conversation id</Section>
      <Field
        label="Conversation id"
        value={conversationId}
        onChangeText={setConversationId}
      />
      <Button label="Get" onPress={doGet} />
      <Button
        label="Mark read"
        onPress={() => doAction((id) => markRead({ id }))}
      />
      <Button label="Archive" onPress={() => doAction((id) => archive({ id }))} />
      <Button
        label="Unarchive"
        onPress={() => doAction((id) => unarchive({ id }))}
      />

      <Result value={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  row: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
  },
  rowTitle: { fontWeight: "600" },
  rowSub: { color: "#666" },
});
