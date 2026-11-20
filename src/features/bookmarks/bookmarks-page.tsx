// Saved-listings page: loads the current user's bookmarks and coordinates selection.
// It composes the list and detail panels used by the bookmarks route.
import { useQuery } from "convex/react";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { BookmarkDetail } from "./components/bookmark-detail";
import { BookmarkList } from "./components/bookmark-list";
import type { SavedBookmark } from "./types";

export default function BookmarksPage() {
  return <BookmarksErrorBoundary />;
}

class BookmarksErrorBoundary extends React.Component<
  object,
  { error: Error | null; retryToken: number }
> {
  state: { error: Error | null; retryToken: number } = {
    error: null,
    retryToken: 0,
  };

  static getDerivedStateFromError(
    error: Error,
  ): Partial<{ error: Error | null; retryToken: number }> {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Bookmarks page failed to load", error);
  }

  render() {
    if (this.state.error) {
      return (
        <BookmarkErrorState
          error={this.state.error}
          onRetry={() =>
            this.setState((state) => ({
              error: null,
              retryToken: state.retryToken + 1,
            }))
          }
        />
      );
    }

    return <BookmarksContent key={this.state.retryToken} />;
  }
}

function BookmarkErrorState({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.errorScreen,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.errorTitle, { color: theme.text }]}>
        Bookmarks couldn&apos;t load
      </Text>
      <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
        {error.message}
      </Text>
      <Text
        accessibilityRole="button"
        onPress={onRetry}
        style={styles.retry}
      >
        Try again
      </Text>
    </View>
  );
}

function BookmarksContent() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [pageWidth, setPageWidth] = useState(width);
  const isMobile = pageWidth < 680;

  const bookmarks = useQuery(api.saved.list);
  const [selectedId, setSelectedId] = useState<Id<"saved">>();
  const [search, setSearch] = useState("");

  const selectedBookmark = bookmarks?.find(
    (bookmark) => bookmark._id === selectedId,
  );
  const activeSelectedId = selectedBookmark ? selectedId : undefined;

  const photoIds = useMemo(() => {
    const thumbnails =
      bookmarks?.map((bookmark) => bookmark.listing?.photos[0]) ?? [];
    const detailPhotos = selectedBookmark?.listing?.photos ?? [];
    return [
      ...new Set([...thumbnails, ...detailPhotos].filter((photo): photo is string =>
        photo !== undefined &&
        !photo.startsWith("http://") &&
        !photo.startsWith("https://"),
      )),
    ];
  }, [bookmarks, selectedBookmark]);
  const photoUrls = useQuery(
    api.storage.getUrls,
    photoIds.length > 0 ? { storageIds: photoIds } : "skip",
  );

  const selectBookmark = (id: SavedBookmark["_id"]) => {
    setSelectedId(id);
  };

  const bookmarkList = (
    <BookmarkList
      bookmarks={bookmarks}
      loading={bookmarks === undefined}
      search={search}
      onSearchChange={setSearch}
      selectedId={activeSelectedId}
      photoUrls={photoUrls ?? undefined}
      onBrowseListings={() => router.push("/")}
      onSelect={selectBookmark}
    />
  );

  return (
    <View
      onLayout={(event: LayoutChangeEvent) =>
        setPageWidth(event.nativeEvent.layout.width)
      }
      style={[
        styles.page,
        { backgroundColor: theme.background },
        isMobile && styles.mobilePage,
      ]}
    >
      {(!isMobile || !activeSelectedId) && bookmarkList}
      {(!isMobile || Boolean(activeSelectedId)) && (
        <BookmarkDetail
          bookmark={selectedBookmark}
          photoUrls={photoUrls ?? undefined}
          onBack={isMobile ? () => setSelectedId(undefined) : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: 0,
    flexDirection: "row",
    gap: 16,
    padding: 20,
  },
  mobilePage: {
    padding: 10,
    gap: 0,
  },
  errorScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  errorMessage: {
    maxWidth: 480,
    marginTop: 8,
    textAlign: "center",
  },
  retry: {
    marginTop: 20,
    overflow: "hidden",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#607D8B",
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
