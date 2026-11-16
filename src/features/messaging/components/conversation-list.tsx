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
import { ConversationCard } from "./conversation-card";
import { ConversationSearch } from "./conversation-search";
import type { Conversation } from "../types";

export function ConversationList({
  conversations,
  loading,
  search,
  onSearchChange,
  selectedId,
  photoUrls,
  refreshing,
  isMobile,
  onRefresh,
  onSelect,
}: {
  conversations?: Conversation[] | null;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  selectedId?: string;
  photoUrls?: Record<string, string | null>;
  refreshing: boolean;
  isMobile: boolean;
  onRefresh: () => void;
  onSelect: (id: Conversation["_id"]) => void;
}) {
  const theme = useTheme();
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filtered = (conversations ?? []).filter((conversation) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      conversation.otherUser?.firstName,
      conversation.otherUser?.lastName,
      conversation.otherUser?.username,
      conversation.listing?.title,
      conversation.lastMessage,
    ]
      .filter(Boolean)
      .some((value) => value?.toLocaleLowerCase().includes(normalizedSearch));
  });

  return (
    <View
      style={[
        styles.container,
        isMobile && styles.mobileContainer,
        { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
      ]}
    >
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Buyer and seller conversations
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh conversations"
          disabled={refreshing}
          onPress={onRefresh}
          style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={theme.textSecondary} />
          ) : (
            <Ionicons
              name="refresh-outline"
              size={20}
              color={theme.textSecondary}
            />
          )}
        </Pressable>
      </View>

      <ConversationSearch value={search} onChangeText={onSearchChange} />

      {loading ? (
        <ConversationSkeletons />
      ) : conversations === null ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Sign in to view messages
          </Text>
        </View>
      ) : conversations?.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="chatbubbles-outline"
            size={32}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No conversations yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            You don&apos;t have any conversations yet. Start messaging a seller
            from a listing.
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No conversations match your search.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(conversation) => conversation._id}
          renderItem={({ item }) => (
            <ConversationCard
              conversation={item}
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

function ConversationSkeletons() {
  const theme = useTheme();

  return (
    <View accessibilityLabel="Loading conversations" style={styles.skeletonList}>
      {[0, 1, 2, 3].map((item) => (
        <View key={item} style={styles.skeletonRow}>
          <View
            style={[
              styles.skeletonAvatar,
              { backgroundColor: theme.backgroundSelected },
            ]}
          />
          <View style={styles.skeletonCopy}>
            <View
              style={[
                styles.skeletonLine,
                { backgroundColor: theme.backgroundSelected, width: "65%" },
              ]}
            />
            <View
              style={[
                styles.skeletonLine,
                { backgroundColor: theme.backgroundSelected, width: "90%" },
              ]}
            />
            <View
              style={[
                styles.skeletonLine,
                { backgroundColor: theme.backgroundSelected, width: "48%" },
              ]}
            />
          </View>
        </View>
      ))}
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
  mobileContainer: {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    flex: 1,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headingCopy: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 8,
  },
  list: {
    flex: 1,
    minHeight: 0,
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
  skeletonList: {
    gap: 12,
    paddingTop: 4,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  skeletonCopy: {
    flex: 1,
    gap: 7,
  },
  skeletonLine: {
    height: 8,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.65,
  },
});
