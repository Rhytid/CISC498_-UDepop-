// Detail panel for a selected saved listing, including seller contact and save controls.
// Used alongside BookmarkList on the bookmarks page.
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MessageButton from "@/features/messaging/components/CallingMessagePopup";
import { ListingDetailsContent } from "@/features/listings/components/listing-details-content";
import { BookmarkToggleButton } from "@/features/bookmarks/components/bookmark-toggle-button";
import { useTheme } from "@/shared/hooks/use-theme";
import { SIDEBAR_ACCENT } from "@/shared/components/sidebar/navigation";
import type { SavedBookmark } from "../types";

export function BookmarkDetail({
  bookmark,
  photoUrls,
  onBack,
}: {
  bookmark?: SavedBookmark;
  photoUrls?: Record<string, string | null>;
  onBack?: () => void;
}) {
  const theme = useTheme();
  const listing = bookmark?.listing;

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {onBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to bookmarks"
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={19} color={theme.text} />
            <Text style={[styles.backText, { color: theme.text }]}>
              Bookmarks
            </Text>
          </Pressable>
        )}

        {!bookmark ? (
          <View style={styles.noSelection}>
            <Ionicons
              name="bookmark-outline"
              size={34}
              color={theme.textSecondary}
            />
            <Text style={[styles.noSelectionTitle, { color: theme.text }]}>
              Select a bookmarked listing
            </Text>
            <Text
              style={[styles.noSelectionText, { color: theme.textSecondary }]}
            >
              Choose a saved item to see its photos, seller, and details.
            </Text>
          </View>
        ) : !listing ? (
          <View style={styles.removed}>
            <Ionicons
              name="alert-circle-outline"
              size={38}
              color={theme.textSecondary}
            />
            <Text style={[styles.removedTitle, { color: theme.text }]}>
              Listing unavailable
            </Text>
            <Text
              style={[styles.removedMessage, { color: theme.textSecondary }]}
            >
              This item was removed by its seller and can no longer be viewed.
            </Text>
            <BookmarkToggleButton
              listingId={bookmark.listingId}
              initiallySaved
              showLabel
              style={styles.removeButton}
            />
          </View>
        ) : (
          <>
            <ListingDetailsContent
              listing={listing}
              photoUrls={photoUrls}
              initiallySaved
            />

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  router.push(`/listing/${listing._id}` as Href)
                }
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    borderColor: theme.backgroundSelected,
                    backgroundColor: theme.backgroundElement,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="open-outline" size={18} color={theme.text} />
                <Text style={[styles.actionText, { color: theme.text }]}>
                  View Listing
                </Text>
              </Pressable>
              <MessageButton
                listingId={listing._id}
                style={[
                  styles.actionButton,
                  styles.messageButton,
                  { backgroundColor: SIDEBAR_ACCENT },
                ]}
              >
                <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                <Text style={[styles.actionText, styles.messageText]}>
                  Message Seller
                </Text>
              </MessageButton>
            </View>

            <BookmarkToggleButton
              listingId={listing._id}
              initiallySaved
              showLabel
              style={styles.removeButton}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 16,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    flexGrow: 1,
    padding: 18,
    gap: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingRight: 10,
  },
  backText: {
    fontSize: 13,
    fontWeight: "700",
  },
  noSelection: {
    flex: 1,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  noSelectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  noSelectionText: {
    maxWidth: 340,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  removed: {
    flex: 1,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  removedTitle: {
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },
  removedMessage: {
    maxWidth: 340,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    minHeight: 42,
    flexGrow: 1,
    flexBasis: 140,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageButton: {
    borderWidth: 0,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  messageText: {
    color: "#FFFFFF",
  },
  removeButton: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.75,
  },
});
