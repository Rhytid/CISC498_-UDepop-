// Saves or unsaves a listing through Convex and reflects its current state.
// Reused on listing cards and detail views throughout the marketplace.
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useTheme } from "@/shared/hooks/use-theme";

export function BookmarkToggleButton({
  listingId,
  initiallySaved,
  showLabel = false,
  style,
}: {
  listingId: Id<"listings">;
  initiallySaved?: boolean;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const savedOnServer = useQuery(api.saved.isSaved, { listingId });
  const addBookmark = useMutation(api.saved.add).withOptimisticUpdate(
    (store, args) => {
      const current = store.getQuery(api.saved.isSaved, args);
      if (current !== undefined) {
        store.setQuery(api.saved.isSaved, args, true);
      }
    },
  );
  const removeBookmark = useMutation(api.saved.remove).withOptimisticUpdate(
    (store, args) => {
      const current = store.getQuery(api.saved.isSaved, args);
      if (current !== undefined) {
        store.setQuery(api.saved.isSaved, args, false);
      }

      const bookmarks = store.getQuery(api.saved.list, {});
      if (Array.isArray(bookmarks)) {
        store.setQuery(
          api.saved.list,
          {},
          bookmarks.filter((bookmark) => bookmark.listingId !== args.listingId),
        );
      }
    },
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmedSaved = savedOnServer ?? initiallySaved;
  const isSaved = confirmedSaved ?? false;

  const toggleBookmark = async () => {
    if (pending || confirmedSaved === undefined) {
      return;
    }

    const nextSaved = !isSaved;
    setError(null);
    setPending(true);

    try {
      if (nextSaved) {
        await addBookmark({ listingId });
      } else {
        await removeBookmark({ listingId });
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not update this bookmark.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Remove bookmark" : "Bookmark listing"}
        accessibilityState={{
          disabled: pending || confirmedSaved === undefined,
          selected: isSaved,
        }}
        disabled={pending || confirmedSaved === undefined}
        onPress={() => void toggleBookmark()}
        style={({ pressed }) => [
          styles.button,
          showLabel ? styles.labeledButton : styles.iconButton,
          { backgroundColor: theme.backgroundSelected },
          pressed && styles.pressed,
        ]}
      >
        {pending || confirmedSaved === undefined ? (
          <ActivityIndicator size="small" color={theme.textSecondary} />
        ) : (
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={showLabel ? 18 : 20}
            color={isSaved ? "#607D8B" : theme.text}
          />
        )}
        {showLabel && (
          <Text style={[styles.label, { color: theme.text }]}>
            {isSaved ? "Remove Bookmark" : "Save Listing"}
          </Text>
        )}
      </Pressable>
      {error && (
        <Text
          accessibilityRole="alert"
          style={[
            styles.error,
            { backgroundColor: theme.backgroundElement, color: "#F28B82" },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
  },
  labeledButton: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
  error: {
    maxWidth: 240,
    marginTop: 6,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.72,
  },
});
