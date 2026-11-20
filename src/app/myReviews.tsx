import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

// Alert.alert buttons don't work on react-native-web, so use window.confirm there
function confirmDelete(onConfirm: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm("Delete this review? This can't be undone.")) {
      onConfirm();
    }
    return;
  }
  Alert.alert("Delete review", "This can't be undone.", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: onConfirm },
  ]);
}

function Stars({ score }: { score: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= score ? "star" : "star-outline"}
          size={16}
          color="gold"
        />
      ))}
    </View>
  );
}

export default function MyReviewsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const reviews = useQuery(api.reviews.listByMe);
  const removeReview = useMutation(api.reviews.remove);
  const [deletingId, setDeletingId] = useState<Id<"reviews"> | null>(null);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Opened directly via URL or after a refresh: no history to go back to
      router.replace("/(tabs)");
    }
  };

  const handleDelete = (reviewId: Id<"reviews">) => {
    confirmDelete(async () => {
      setDeletingId(reviewId);
      try {
        await removeReview({ reviewId });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Try again";
        if (Platform.OS === "web") {
          window.alert(`Couldn't delete review: ${message}`);
        } else {
          Alert.alert("Couldn't delete review", message);
        }
      } finally {
        setDeletingId(null);
      }
    });
  };

  const backButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={goBack}
      hitSlop={10}
      style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
    >
      <Ionicons name="chevron-back" size={22} color={theme.text} />
      <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
    </Pressable>
  );

  if (reviews === undefined) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.content}>{backButton}</View>
        <View style={styles.center}>
          <Text style={{ color: theme.textSecondary }}>Loading…</Text>
        </View>
      </View>
    );
  }

  if (reviews === null) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.content}>{backButton}</View>
        <View style={styles.center}>
          <Text style={{ color: theme.textSecondary }}>
            Sign in to see your reviews.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.list, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={reviews}
      keyExtractor={(review) => review._id}
      ListHeaderComponent={
        <View>
          {backButton}
          <Text style={[styles.heading, { color: theme.text }]}>
            My Reviews
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: theme.textSecondary }]}>
          You haven't written any reviews yet.
        </Text>
      }
      renderItem={({ item }) => {
        const isDeleting = deletingId === item._id;
        return (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
              isDeleting && styles.deleting,
            ]}
          >
            <View style={styles.cardHeader}>
              {item.ratee?.profilePicture ? (
                <Image
                  source={{ uri: item.ratee.profilePicture }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar} />
              )}
              <View style={styles.headerCopy}>
                <Text style={[styles.username, { color: theme.text }]}>
                  {item.ratee?.username ?? "Deleted user"}
                </Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Stars score={item.score} />
            </View>

            {item.comment ? (
              <Text style={[styles.comment, { color: theme.text }]}>
                {item.comment}
              </Text>
            ) : (
              <Text style={[styles.noComment, { color: theme.textSecondary }]}>
                No comment
              </Text>
            )}

            <Pressable
              disabled={isDeleting}
              onPress={() => handleDelete(item._id)}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.deleteText}>
                {isDeleting ? "Deleting…" : "Delete"}
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 2,
    paddingVertical: 6,
    marginBottom: 8,
  },
  backText: { fontSize: 16, fontWeight: "600" },
  heading: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  empty: { textAlign: "center", marginTop: 24 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  deleting: { opacity: 0.5 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerCopy: { flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#cccccc",
  },
  username: { fontSize: 16, fontWeight: "600" },
  date: { fontSize: 12, marginTop: 2 },
  starsRow: { flexDirection: "row" },
  comment: { fontSize: 14, lineHeight: 20 },
  noComment: { fontSize: 14, fontStyle: "italic" },
  deleteButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#fdecea",
  },
  deleteText: { color: "#c62828", fontWeight: "600" },
  pressed: { opacity: 0.7 },
});
