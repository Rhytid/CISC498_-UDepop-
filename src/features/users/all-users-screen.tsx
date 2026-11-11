import { usePaginatedQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { api } from "@convex/_generated/api";
import { useTheme } from "@/shared/hooks/use-theme";

export default function AllUsersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.listAll,
    {},
    { initialNumItems: 20 },
  );

  if (results === undefined) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.list, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(user) => user._id}
      ListHeaderComponent={
        <Text style={[styles.heading, { color: theme.text }]}>All Users</Text>
      }
      ListEmptyComponent={
        <Text style={{ color: theme.textSecondary, textAlign: "center" }}>
          No users yet.
        </Text>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({ pathname: "/a-user", params: { id: item._id } })
          }
          style={({ pressed }) => [
            styles.userRow,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
            },
            pressed && styles.pressed,
          ]}
        >
          <Image source={{ uri: item.pfp }} style={styles.avatar} />
          <Text style={[styles.username, { color: theme.text }]}>
            {item.username}
          </Text>
        </Pressable>
      )}
      ListFooterComponent={
        status === "CanLoadMore" ? (
          <Pressable
            onPress={() => loadMore(5)}
            style={({ pressed }) => [
              styles.loadMore,
              { backgroundColor: theme.backgroundSelected },
              pressed && styles.pressed,
            ]}
          >
            <Text style={{ color: theme.text }}>Load More</Text>
          </Pressable>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
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
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#cccccc" },
  username: { fontSize: 16, fontWeight: "600" },
  loadMore: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  pressed: { opacity: 0.7 },
});