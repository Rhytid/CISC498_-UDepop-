import { useMutation, useQuery, useConvex } from "convex/react";
import {
  useWindowDimensions,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import type { FunctionReturnType } from "convex/server";
import { useLocalSearchParams } from "expo-router";

import { useTheme } from "@/shared/hooks/use-theme";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ChatWindow } from "./chat-window";
import { ConversationList } from "./conversation-list";
import type { Conversation } from "../types";

type ConversationQueryResult = FunctionReturnType<typeof api.conversations.list>;

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
  const [search, setSearch] = useState("");
  const [refreshResult, setRefreshResult] = useState<
    ConversationQueryResult | undefined
  >(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const { conversationId } = useLocalSearchParams<{
    conversationId?: string | string[];
  }>();

  useEffect(() => {
    const param = Array.isArray(conversationId)
      ? conversationId[0]
      : conversationId;
    if (param && param !== "undefined") {
      setSelectedId(param as Id<"conversations">);
    }
  }, [conversationId]);

  const displayedConversations =
    refreshResult !== undefined ? refreshResult : conversations;
  const selectedConversation = displayedConversations?.find(
    (conversation) => conversation._id === selectedId,
  );
  const messages = useQuery(
    api.messages.list,
    selectedId ? { conversationId: selectedId } : "skip",
  );

  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.conversations.markRead);

  useEffect(() => {
    setRefreshResult(undefined);
  }, [conversations]);

  useEffect(() => {
    if (selectedId && displayedConversations && !selectedConversation) {
      setSelectedId(undefined);
    }
  }, [displayedConversations, selectedConversation, selectedId]);

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
    if (!selectedId || !unreadMessages) {
      return;
    }

    markRead({ id: selectedId }).catch((error: unknown) => {
      setOperationError(
        error instanceof Error ? error.message : "Could not mark messages read.",
      );
    });
  }, [markRead, selectedId, unreadMessages]);

  const photoIds = useMemo(() => {
    const listingPhotos =
      displayedConversations?.flatMap(
        (conversation) => conversation.listing?.photos.slice(0, 1) ?? [],
      ) ?? [];
    const messagePhotos =
      messages
        ?.filter((message) => message.messageType === "image")
        .map((message) => message.body) ?? [];

    return [...new Set([...listingPhotos, ...messagePhotos])].filter(
      (photo) => !photo.startsWith("http://") && !photo.startsWith("https://"),
    );
  }, [displayedConversations, messages]);
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
        error instanceof Error ? error.message : "Could not refresh conversations.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleSend = async (body: string) => {
    if (!selectedId) {
      return false;
    }

    setSending(true);
    setOperationError(null);
    try {
      await sendMessage({ conversationId: selectedId, body });
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
    setOperationError(null);
  };

  const conversationList = (
    <ConversationList
      conversations={displayedConversations}
      loading={conversations === undefined}
      search={search}
      onSearchChange={setSearch}
      selectedId={selectedId}
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
      {(!isMobile || !selectedId) && conversationList}
      {(!isMobile || Boolean(selectedId)) && (
        selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={me?._id}
            isSeller={
              selectedConversation.listing && me?._id
                ? selectedConversation.listing.ownerId === me._id
                : undefined
            }
            loading={messages === undefined}
            sending={sending}
            error={operationError}
            photoUrls={photoUrls}
            onSend={handleSend}
            onBack={isMobile ? () => setSelectedId(undefined) : undefined}
          />
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
            <Text style={[styles.noSelectionText, { color: theme.textSecondary }]}>
              Choose a buyer or seller conversation to see its messages and
              listing details.
            </Text>
          </View>
        )
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
