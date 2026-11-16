import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { BookmarkCard } from "./bookmark-card";
import { BookmarkSearch } from "./bookmark-search";
import type { SavedBookmark } from "../types";

export function BookmarkList({
  bookmarks,
  loading,
  search,
  onSearchChange,
  selectedId,
  photoUrls,
  onBrowseListings,
  onSelect,
}: {
  bookmarks?: SavedBookmark[] | null;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  selectedId?: string;
  photoUrls?: Record<string, string | null>;
  onBrowseListings: () => void;
  onSelect: (id: SavedBookmark["_id"]) => void;
}) {
  const theme = useTheme();
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filtered = (bookmarks ?? []).filter(({ listing }) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      listing?.title,
      listing?.seller?.username,
      listing ? undefined : "unavailable removed",
    ]
      .filter(Boolean)
      .some((value) => value?.toLocaleLowerCase().includes(normalizedSearch));
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderColor: theme.backgroundSelected,
        },
      ]}
    >
      <View>
        <Text style={[styles.title, { color: theme.text }]}>Bookmarks</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Saved listings
        </Text>
      </View>

      <BookmarkSearch value={search} onChangeText={onSearchChange} />

      {loading ? (
        <BookmarkSkeletons />
      ) : bookmarks === null ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Sign in to view bookmarks
          </Text>
        </View>
      ) : bookmarks?.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="bookmark-outline"
            size={32}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No bookmarked listings yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Save items to quickly find them later.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onBrowseListings}
            style={({ pressed }) => [
              styles.browseButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.browseButtonText}>Browse listings</Text>
          </Pressable>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No bookmarks match your search.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(bookmark) => bookmark._id}
          renderItem={({ item }) => (
            <BookmarkCard
              bookmark={item}
              selected={item._id === selectedId}
              photoUrls={photoUrls}
              onPress={() => onSelect(item._id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

function BookmarkSkeletons() {
  const theme = useTheme();

  return (
    <View accessibilityLabel="Loading bookmarks" style={styles.skeletonList}>
      {[0, 1, 2, 3].map((item) => (
        <View key={item} style={styles.skeletonRow}>
          <View
            style={[
              styles.skeletonThumbnail,
              { backgroundColor: theme.backgroundSelected },
            ]}
          />
          <View style={styles.skeletonCopy}>
            <View
              style={[
                styles.skeletonLine,
                { backgroundColor: theme.backgroundSelected, width: "68%" },
              ]}
            />
            <View
              style={[
                styles.skeletonLine,
                { backgroundColor: theme.backgroundSelected, width: "44%" },
              ]}
            />
            <View
              style={[
                styles.skeletonLine,
                { backgroundColor: theme.backgroundSelected, width: "82%" },
              ]}
            />
          </View>
        </View>
      ))}
      <ActivityIndicator
        accessibilityLabel="Loading saved listings"
        color={theme.textSecondary}
        style={styles.loadingIndicator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 340,
    maxWidth: "42%",
    minWidth: 260,
    flexDirection: "column",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    overflow: "hidden",
    minHeight: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  list: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    paddingBottom: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    maxWidth: 280,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  browseButton: {
    marginTop: 6,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#607D8B",
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  skeletonList: {
    flex: 1,
    gap: 12,
    paddingTop: 4,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  skeletonThumbnail: {
    width: 58,
    height: 58,
    borderRadius: 9,
  },
  skeletonCopy: {
    flex: 1,
    gap: 7,
  },
  skeletonLine: {
    height: 8,
    borderRadius: 4,
  },
  loadingIndicator: {
    marginTop: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
