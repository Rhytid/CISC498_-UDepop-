
import { Picker } from "@react-native-picker/picker";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { api } from "@convex/_generated/api";

export default function AllUsersScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [sortBy, setSortBy] = useState<
    "username" | "reviews" | "listings"
  >("username");
  const [search, setSearch] = useState("");

  const searchedUsers = useQuery(
    api.users.search,
    search.trim() ? { query: search.trim() } : "skip"
  );

  const { results, status, loadMore } = usePaginatedQuery(
    api.users.listAll,
    { sortBy },
    { initialNumItems: 20 }
  );

  const usersShown = search.trim()
    ? searchedUsers?.map((user) => ({
        _id: user._id,
        username: user.username,
        pfp: user.profilePicture,
        firstName: user.firstName,
        lastName: user.lastName,
      })) ?? []
    : results;

  if (results === undefined) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.list, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={usersShown}
      keyExtractor={(user) => user._id}
      ListHeaderComponent={
        <View>
          <Text style={[styles.heading, { color: theme.text }]}>
            All Users
          </Text>

          <TextInput
            placeholder="Search users..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={[
              styles.searchBar,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
                borderColor: theme.backgroundSelected,
              },
            ]}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sortBy}
              onValueChange={(value) => setSortBy(value)}
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              <Picker.Item label="Username (A-Z)" value="username" />
              <Picker.Item label="Highest Rated" value="reviews" />
              <Picker.Item label="Most Listings" value="listings" />
            </Picker>
          </View>
        </View>
      }
      ListEmptyComponent={
        search.trim() && searchedUsers === undefined ? (
          <ActivityIndicator />
        ) : (
          <Text style={{ color: theme.textSecondary, textAlign: "center" }}>
            No users found.
          </Text>
        )
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/a-user",
              params: { id: item._id },
            })
          }
          style={({ pressed }) => [
            styles.userRow,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
            },
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={
              item.pfp
                ? { uri: item.pfp }
                : require("@/assets/images/default-profile-picture.png")
            }
            style={styles.avatar}
          />

          <View>
            <Text style={[styles.name, { color: theme.text }]}>
              {[item.firstName, item.lastName].filter(Boolean).join(" ") ||
                item.username}
            </Text>

            <Text style={[styles.username, { color: theme.textSecondary }]}>
              @{item.username}
            </Text>
          </View>
        </Pressable>
      )}
      ListFooterComponent={
        !search.trim() && status === "CanLoadMore" ? (
          <Pressable
            onPress={() => loadMore(5)}
            style={({ pressed }) => [
              styles.loadMore,
              { backgroundColor: theme.backgroundSelected },
              pressed && styles.pressed,
            ]}
          >
            <Text style={{ color: theme.text }}>Load More</Text>
          </Pressable>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { padding: 16, gap: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 24, fontWeight: "800", marginBottom: 16 },
  searchBar: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  pickerContainer: {
    width: 200,
    marginBottom: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#cccccc",
  },
  name: { fontSize: 17, fontWeight: "bold" },
  username: { fontSize: 13, marginTop: 3 },
  loadMore: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  pressed: { opacity: 0.7 },
});
