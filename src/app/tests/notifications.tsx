import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function NotificationsTest() {
  const notifications = useQuery(api.notifications.list);
  const unread = useQuery(api.notifications.unreadCount);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const [notificationId, setNotificationId] = useState("");
  const [result, setResult] = useState("");

  const doMarkRead = async () => {
    if (!notificationId) return;
    try {
      await markRead({ id: notificationId as Id<"notifications"> });
      setResult("marked read");
    } catch (e) {
      setResult(String(e));
    }
  };

  const doMarkAll = async () => {
    try {
      const res = await markAllRead();
      setResult(JSON.stringify(res));
    } catch (e) {
      setResult(String(e));
    }
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>Unread count: {unread ?? 0}</Section>
      <Button label="Mark all read" onPress={doMarkAll} />

      <Section>Notifications</Section>
      {notifications === undefined ? (
        <Text>Loading…</Text>
      ) : notifications === null ? (
        <Text>Not authenticated</Text>
      ) : (
        notifications.map((n) => (
          <View key={n._id} style={styles.row}>
            <Text style={styles.rowTitle}>
              [{n.type}] {n.body}
            </Text>
            <Text style={styles.rowSub}>
              id: {n._id} · {n.read ? "read" : "unread"}
            </Text>
          </View>
        ))
      )}

      <Section>Mark one read</Section>
      <Field
        label="Notification id"
        value={notificationId}
        onChangeText={setNotificationId}
      />
      <Button label="Mark read" onPress={doMarkRead} />

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
  rowSub: { color: "#666", fontSize: 12 },
});
