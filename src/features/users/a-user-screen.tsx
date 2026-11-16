import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

import ItemCard from "@/features/listings/components/itemCard";
import { useListingActions } from "@/features/listings/hooks/listingActions";

export default function AUserScreen() {
  const theme = useTheme();
  const me = useQuery(api.users.getMe);
  const { sellList, deleteListing } = useListingActions();
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
        <View style={styles.banner}>
          <Image source ={ user.profilePicture ? { uri: user.profilePicture } : require ("@/assets/images/default-profile-picture.png")}
            style={styles.profilePicture}>
          </Image>
          <Text style={styles.profileUsername}>
            @{user.username}
          </Text>
          <Text style={styles.profileText}>
            {user.firstName} {user.lastName}
          </Text>
          {user.bio ? (
            <Text style={styles.profileText}>
              {user.bio}
            </Text>
          ) : 
            <Text>
              No bio yet.
            </Text>
          }
          {user.location ? (
            <Text style={styles.profileText}>
              {user.location}
            </Text>
          ) :
            <Text>
              No location set.
            </Text>
          }
          <Text style={styles.profileText}>
            {listings.length} listings
          </Text>
        </View>
        <View style={styles.itemContainer}>
          {listings.map((item) => 
            <ItemCard
              key={item._id}
              listing={item}
              currentUserId={me?._id}
              onSellListing={sellList}
              onDeleteListing={deleteListing}
              >
            </ItemCard>
          )}
        </View>
          )
        )
      </>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
    >
      <Pressable
        onPress={() => router.navigate("/all-users")}
        accessibilityRole="button"
        accessibilityLabel="Back to All Users"
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="arrow-back" size={22} color={theme.text}/>
        <Text style={[styles.backText, { color: theme.text }]}>
          Back
        </Text>
      </Pressable>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  banner: {
    width: "100%",
    minHeight: 300,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#607D8B",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 8,
  },
  profileUsername: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  profileText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 10,
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