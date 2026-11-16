import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useTheme } from "@/shared/hooks/use-theme";

export default function AUserScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = id && id !== "index" ? (id as Id<"users">) : undefined;

  const user = useQuery(api.users.getById, userId ? { userId } : "skip");
  const listings = useQuery(
    api.listings.listByUser,
    userId ? { userId } : "skip",
  );

  const loading = user === undefined || listings === undefined;

  let content;
  if (!userId) {
    content = (
      <View style={styles.center}>
        <Text style={{ color: theme.textSecondary }}>No user selected.</Text>
      </View>
    );
  } else if (loading) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  } else if (user === null) {
    content = (
      <View style={styles.center}>
        <Text style={{ color: theme.textSecondary }}>User not found.</Text>
      </View>
    );
  } else {
    content = (
      <>
        <Text style={[styles.heading, { color: theme.text }]}>
          @{user.username}
        </Text>
        {listings.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ color: theme.textSecondary }}>No listings yet</Text>
          </View>
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(listing) => listing._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.listingCard,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
              >
                <Text style={[styles.listingTitle, { color: theme.text }]}>
                  {item.title}
                </Text>
                <Text
                  style={[styles.listingPrice, { color: theme.textSecondary }]}
                >
                  ${item.price}
                  {item.sold ? " · Sold" : ""}
                </Text>
              </View>
            )}
          />
        )}
      </>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable
        onPress={() => router.navigate("/all-users")}
        accessibilityRole="button"
        accessibilityLabel="Back to All Users"
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Ionicons name="arrow-back" size={22} color={theme.text} />
        <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
      </Pressable>

      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 8,
  },
  backText: { fontSize: 16, fontWeight: "600" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  heading: { fontSize: 24, fontWeight: "800", marginBottom: 12 },
  listContent: { gap: 10, paddingBottom: 16 },
  listingCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  listingTitle: { fontSize: 16, fontWeight: "600" },
  listingPrice: { fontSize: 14 },
  pressed: { opacity: 0.7 },
});