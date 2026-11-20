import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { api } from "@convex/_generated/api";

import { Id } from "@convex/_generated/dataModel";
import { FunctionReference } from "convex/server";
import { GenericId } from "convex/values";

export default function whichUserScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const theme = useTheme();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const candidates = useQuery(api.conversations.listBuyerCandidates, {
    listingId: listingId as Id<"listings">,
  });
  const sendSoldNotice = useMutation(api.messages.sendSoldNotice);

  const handleSelect = async (conversationId: Id<"conversations">) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { buyerId } = await sendSoldNotice({ conversationId });
      router.push({ pathname: "/(tabs)", params: { id: buyerId, listingId } });
    } catch (e) {
      Alert.alert(
        "Couldn't notify buyer",
        e instanceof Error ? e.message : "Try again",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <FlatList
      style={[styles.list, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={candidates ?? []}
      keyExtractor={(row) => row.conversationId}
      ListHeaderComponent={
        <Text style={[styles.heading, { color: theme.text }]}>
          Who bought this item?
        </Text>
      }
      ListEmptyComponent={
        <Text style={{ color: theme.textSecondary, textAlign: "center" }}>
          {candidates === undefined
            ? "Loading…"
            : "Nobody has messaged you about this item."}
        </Text>
      }
      renderItem={({ item }) => (
        <Pressable
          disabled={submitting}
          onPress={() => handleSelect(item.conversationId)}
          style={({ pressed }) => [
            styles.userRow,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
            },
            (pressed || submitting) && styles.pressed,
          ]}
        >
          <Image source={{ uri: item.pfp }} style={styles.avatar} />
          <Text style={[styles.username, { color: theme.text }]}>
            {item.username}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 2 },
  content: { padding: 16, gap: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#cccccc",
  },
  username: { fontSize: 16, fontWeight: "600" },
  loadMore: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  pressed: { opacity: 0.7 },
});
function UseMutation(
  send: FunctionReference<
    "mutation",
    "public",
    {
      listingId?: GenericId<"listings"> | undefined;
      conversationId?: GenericId<"conversations"> | undefined;
      body: string;
    },
    {
      _id: GenericId<"messages">;
      _creationTime: number;
      conversationId: GenericId<"conversations">;
      senderId: GenericId<"users">;
      body: string;
      timestamp: number;
      read: boolean;
      messageType: string;
    },
    string | undefined
  >,
) {
  throw new Error("Function not implemented.");
}
