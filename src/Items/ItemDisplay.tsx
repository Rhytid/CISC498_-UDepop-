import MessageButton from "@/app/UserMessaging/CallingMessagePopup";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function ListingList() {
  const [search, setSearch] = useState("");

  const result = useQuery(api.listings.list, {
    searchText: search || undefined,
  });

  if (result === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Loading listings…</Text>
      </View>
    );
  }

  // Seller name component (unchanged)
  function SellerName({ userId }: { userId: Id<"users"> }) {
    const user = useQuery(api.users.getById, { userId });
    if (user === undefined) return <Text style={styles.seller}>Seller: …</Text>;
    if (user === null)
      return <Text style={styles.seller}>Seller: Unknown</Text>;
    return <Text style={styles.seller}>Seller: {user.username}</Text>;
  }

  // PhotoRow: resolves storage ids to URLs by calling server query once per listing
  function PhotoRow({ photos }: { photos?: string[] }) {
    // If photos are already URLs, render them directly
    const areUrls = photos?.every(
      (p) => typeof p === "string" && p.startsWith("http"),
    );
    // If they are storage ids, call server query to resolve
    const urlMap = useQuery(
      api.storage.getUrls,
      !areUrls && photos && photos.length > 0 ? { storageIds: photos } : "skip",
    ) as Record<string, string | null> | undefined;

    if (!photos || photos.length === 0) {
      return <Text style={styles.noPhoto}>No photos</Text>;
    }

    const thumbs = photos.slice(0, 4);
    return (
      <View style={styles.gallery}>
        {thumbs.map((p) => {
          const uri = areUrls ? p : urlMap ? (urlMap[p] ?? null) : undefined;
          if (uri === undefined) {
            return (
              <View key={p} style={styles.photoPlaceholder}>
                <ActivityIndicator size="small" />
              </View>
            );
          }
          if (uri === null) {
            return (
              <View key={p} style={styles.photoPlaceholder}>
                <Text style={styles.noPhoto}>No photo</Text>
              </View>
            );
          }
          return <Image key={p} source={{ uri }} style={styles.photo} />;
        })}
        {photos.length > thumbs.length ? (
          <View style={styles.moreWrap}>
            <Text style={styles.moreText}>
              +{photos.length - thumbs.length}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search listings..."
        style={styles.search}
      />

      <FlatList
        data={result.page}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.empty}>No listings found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>

            <SellerName userId={item.ownerId} />

            <Text style={styles.description}>{item.description}</Text>

            <Text style={styles.tags}>{(item.tags || []).join(", ")}</Text>

            <PhotoRow photos={item.photos as string[] | undefined} />

            <MessageButton listingId={item._id} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontWeight: "700", fontSize: 16 },
  price: { fontWeight: "600", color: "#0a84ff" },
  seller: { color: "#444", marginTop: 4 },
  description: { marginTop: 8, color: "#333" },
  tags: { marginTop: 6, color: "#666", fontStyle: "italic" },

  gallery: { flexDirection: "row", marginTop: 10, alignItems: "center" },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 6,
    backgroundColor: "#f2f2f2",
    marginRight: 8,
  },
  photoPlaceholder: {
    width: 120,
    height: 90,
    borderRadius: 6,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  noPhoto: { color: "#888" },
  moreWrap: {
    width: 40,
    height: 90,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: { color: "#444", fontWeight: "600" },

  empty: { padding: 20, textAlign: "center", color: "#666" },
});
