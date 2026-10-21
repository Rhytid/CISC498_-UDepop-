import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useConvex, useMutation } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function MessagesTest() {
  const convex = useConvex();
  const send = useMutation(api.messages.send);
  const remove = useMutation(api.messages.remove);

  const [conversationId, setConversationId] = useState("");
  const [body, setBody] = useState("");
  const [messages, setMessages] = useState<unknown>(undefined);
  const [result, setResult] = useState("");

  const doList = async () => {
    if (!convex || !conversationId) return;
    try {
      const list = await convex.query(api.messages.list, {
        conversationId: conversationId as Id<"conversations">,
      });
      setMessages(list);
      setResult("");
    } catch (e) {
      setResult(String(e));
    }
  };

  const doSend = async () => {
    if (!conversationId || !body) return;
    try {
      await send({
        conversationId: conversationId as Id<"conversations">,
        body,
      });
      setBody("");
      setResult("sent");
    } catch (e) {
      setResult(String(e));
    }
  };

  const doRemove = async (id: string) => {
    try {
      await remove({ id: id as Id<"messages"> });
      setResult("deleted");
    } catch (e) {
      setResult(String(e));
    }
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>Messages</Section>
      <Field
        label="Conversation id"
        value={conversationId}
        onChangeText={setConversationId}
      />
      <Button label="Load messages" onPress={doList} />

      {Array.isArray(messages) &&
        messages.map((m: { _id: string; body: string; senderId: string }) => (
          <View key={m._id} style={styles.row}>
            <Text style={styles.rowTitle}>{m.body}</Text>
            <Text style={styles.rowSub}>from {m.senderId}</Text>
            <Button label="Delete" onPress={() => doRemove(m._id)} />
          </View>
        ))}

      <Section>Send</Section>
      <Field label="Body" value={body} onChangeText={setBody} />
      <Button label="Send message" onPress={doSend} />

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
    gap: 4,
  },
  rowTitle: { fontWeight: "600" },
  rowSub: { color: "#666", fontSize: 12 },
});
