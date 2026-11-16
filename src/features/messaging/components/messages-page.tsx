import { useConvex, useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ChatWindow } from "./chat-window";
import { ConversationList } from "./conversation-list";
import type { ConversationContext } from "../types";

type ConversationQueryResult = FunctionReturnType<
  typeof api.conversations.list
>;

export default function MessagesPage() {
  return <MessagesErrorBoundary />;
}

class MessagesErrorBoundary extends React.Component<
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
    console.error("Messages page failed to load", error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorScreen}>
          <Text style={styles.errorTitle}>Messages couldn&apos;t load</Text>
          <Text style={styles.errorMessage}>{this.state.error.message}</Text>
          <Text
            accessibilityRole="button"
            onPress={() =>
              this.setState((state) => ({
                error: null,
                retryToken: state.retryToken + 1,
              }))
            }
            style={styles.retry}
          >
            Try again
          </Text>
        </View>
      );
    }

    return <MessagesContent key={this.state.retryToken} />;
  }
}

function MessagesContent() {
  const theme = useTheme();
  const convex = useConvex();
  const { width } = useWindowDimensions();
  const [pageWidth, setPageWidth] = useState(width);
  const isMobile = pageWidth < 680;

  const conversations = useQuery(api.conversations.list);
  const me = useQuery(api.users.getMe);
  const [selectedId, setSelectedId] = useState<Id<"conversations">>();
  const [draftListingId, setDraftListingId] = useState<Id<"listings">>();
  const [search, setSearch] = useState("");
  const [refreshResult, setRefreshResult] = useState<
    ConversationQueryResult | undefined
  >(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const { conversationId, listingId } = useLocalSearchParams<{
    conversationId?: string | string[];
    listingId?: string | string[];
  }>();

  useEffect(() => {
    const conversationParam = Array.isArray(conversationId)
      ? conversationId[0]
      : conversationId;
    const listingParam = Array.isArray(listingId)
      ? listingId[0]
      : listingId;

    if (conversationParam && conversationParam !== "undefined") {
      setSelectedId(conversationParam as Id<"conversations">);
      setDraftListingId(undefined);
    } else if (listingParam && listingParam !== "undefined") {
      setSelectedId(undefined);
      setDraftListingId(listingParam as Id<"listings">);
    } else {
      setSelectedId(undefined);
      setDraftListingId(undefined);
    }
  }, [conversationId, listingId]);

  const displayedConversations = useMemo(() => {
    const source = refreshResult !== undefined ? refreshResult : conversations;
    return source?.filter((conversation) => conversation.lastMessage);
  }, [refreshResult, conversations]);
  const existingDraftConversation = draftListingId
    ? displayedConversations?.find(
        (conversation) => conversation.listingId === draftListingId,
      )
    : undefined;
  const activeConversationId = selectedId ?? existingDraftConversation?._id;
  const draftListing = useQuery(
    api.listings.get,
    draftListingId ? { id: draftListingId } : "skip",
  );
  const draftConversation: ConversationContext | undefined = draftListing
    ? {
        otherUser: draftListing.seller,
        listing: {
          _id: draftListing._id,
          ownerId: draftListing.ownerId,
          title: draftListing.title,
          price: draftListing.price,
          photos: draftListing.photos,
        },
      }
    : undefined;
  const selectedFromGet = useQuery(
    api.conversations.get,
    activeConversationId ? { id: activeConversationId } : "skip",
  );

  const selectedConversation =
    displayedConversations?.find((c) => c._id === activeConversationId) ??
    selectedFromGet ??
    draftConversation;
  const messages = useQuery(
    api.messages.list,
    activeConversationId
      ? { conversationId: activeConversationId }
      : "skip",
  );
  useEffect(() => {
    if (selectedId && selectedFromGet === null) {
      setSelectedId(undefined);
    }
  }, [selectedFromGet, selectedId]);
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.conversations.markRead);

  useEffect(() => {
    setRefreshResult(undefined);
  }, [conversations]);

  const unreadMessages = useMemo(
    () =>
      Boolean(
        me?._id &&
        messages?.some(
          (message) => message.senderId !== me._id && !message.read,
        ),
      ),
    [me?._id, messages],
  );

  useEffect(() => {
    if (!activeConversationId || !unreadMessages) {
      return;
    }

    markRead({ id: activeConversationId }).catch((error: unknown) => {
      setOperationError(
        error instanceof Error
          ? error.message
          : "Could not mark messages read.",
      );
    });
  }, [activeConversationId, markRead, unreadMessages]);

  const photoIds = useMemo(() => {
    const listingPhotos =
      displayedConversations?.flatMap(
        (conversation) => conversation.listing?.photos.slice(0, 1) ?? [],
      ) ?? [];
    const messagePhotos =
      messages
        ?.filter((message) => message.messageType === "image")
        .map((message) => message.body) ?? [];
    const draftPhotos = draftListing?.photos.slice(0, 1) ?? [];

    return [...new Set([...listingPhotos, ...messagePhotos, ...draftPhotos])].filter(
      (photo) => !photo.startsWith("http://") && !photo.startsWith("https://"),
    );
  }, [displayedConversations, draftListing, messages]);
  const photoUrls = useQuery(
    api.storage.getUrls,
    photoIds.length > 0 ? { storageIds: photoIds } : "skip",
  );

  const refreshConversations = async () => {
    setRefreshing(true);
    setOperationError(null);

    try {
      const result = await convex.query(api.conversations.list, {});
      setRefreshResult(result);
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "Could not refresh conversations.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleSend = async (body: string) => {
    if (!activeConversationId && !draftListingId) {
      return false;
    }

    setSending(true);
    setOperationError(null);
    try {
      if (activeConversationId) {
        await sendMessage({ conversationId: activeConversationId, body });
      } else if (draftListingId) {
        const message = await sendMessage({ listingId: draftListingId, body });
        setSelectedId(message.conversationId);
      }
      return true;
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : "Could not send this message.",
      );
      return false;
    } finally {
      setSending(false);
    }
  };

  const selectConversation = (id: Id<"conversations">) => {
    setSelectedId(id);
    setDraftListingId(undefined);
    setOperationError(null);
    router.setParams({ conversationId: id, listingId: undefined });
  };

  const backToConversations = () => {
    setSelectedId(undefined);
    setDraftListingId(undefined);
    setOperationError(null);
    router.setParams({ conversationId: undefined, listingId: undefined });
  };

  const hasActiveChat = Boolean(activeConversationId || draftListingId);
  const chatMessages = activeConversationId ? messages : [];

  const conversationList = (
    <ConversationList
      conversations={displayedConversations}
      loading={conversations === undefined}
      search={search}
      onSearchChange={setSearch}
      selectedId={activeConversationId}
      photoUrls={photoUrls}
      refreshing={refreshing}
      isMobile={isMobile}
      onRefresh={refreshConversations}
      onSelect={selectConversation}
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
      {operationError && !selectedConversation && (
        <Text accessibilityRole="alert" style={styles.operationError}>
          {operationError}
        </Text>
      )}
      {(!isMobile || !hasActiveChat) && conversationList}
      {(!isMobile || hasActiveChat) &&
        (selectedConversation ? (
          <ChatWindow
            key={activeConversationId ?? `draft-${draftListingId}`}
            conversation={selectedConversation}
            messages={chatMessages}
            currentUserId={me?._id}
            isSeller={
              selectedConversation.listing && me?._id
                ? selectedConversation.listing.ownerId === me._id
                : undefined
            }
            loading={Boolean(activeConversationId && messages === undefined)}
            sending={sending}
            error={operationError}
            photoUrls={photoUrls}
            onSend={handleSend}
            onBack={isMobile ? backToConversations : undefined}
          />
        ) : draftListingId && draftListing === undefined ? (
          <View
            style={[
              styles.noSelection,
              { borderColor: theme.backgroundSelected },
            ]}
          >
            <ActivityIndicator color={theme.textSecondary} />
            <Text style={[styles.noSelectionText, { color: theme.textSecondary }]}>
              Loading listing…
            </Text>
          </View>
        ) : draftListingId && draftListing === null ? (
          <View
            style={[
              styles.noSelection,
              { borderColor: theme.backgroundSelected },
            ]}
          >
            <Text style={[styles.noSelectionTitle, { color: theme.text }]}>
              Listing unavailable
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={backToConversations}
            >
              <Text style={[styles.noSelectionText, { color: theme.textSecondary }]}>
                Back to conversations
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.noSelection,
              { borderColor: theme.backgroundSelected },
            ]}
          >
            <Text style={[styles.noSelectionTitle, { color: theme.text }]}>
              Select a conversation
            </Text>
            <Text
              style={[styles.noSelectionText, { color: theme.textSecondary }]}
            >
              Choose a buyer or seller conversation to see its messages and
              listing details.
            </Text>
          </View>
        ))}
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
  noSelection: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
  },
  noSelectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  noSelectionText: {
    maxWidth: 360,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  operationError: {
    position: "absolute",
    top: 4,
    right: 12,
    zIndex: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FCE8E6",
    color: "#B3261E",
    fontSize: 12,
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
    marginTop: 8,
    maxWidth: 480,
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
