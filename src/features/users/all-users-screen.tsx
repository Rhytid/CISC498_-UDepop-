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
import { Ionicons } from "@expo/vector-icons";

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
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.heading, { color: theme.text }]}>
                All Users
              </Text>
              <Text style={{ color: theme.textSecondary }}>
                Discover other users
              </Text>
            </View>
            </View>
            <View style={[
              styles.searchBar,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
            ]}>
              <Ionicons name="search-outline" size={23} color={theme.textSecondary}/>
              <TextInput
                placeholder="Search by name or username"
                placeholderTextColor={theme.textSecondary}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: theme.text }]}
              >
              </TextInput>
            </View>
            <View style={styles.orgRow}>
              <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
                Browse profiles
              </Text>
              <View style={[styles.pickerContainer, { borderColor: theme.backgroundSelected },
                ]}
              >
                <Picker
                  selectedValue={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                  style={{
                    width: "100%",
                    height: 44,
                    color: theme.text,
                    backgroundColor: theme.backgroundElement,
                    borderWidth: 0,
                  }}
                >
                  <Picker.Item label="Username (A-Z)" value="username"/>
                  <Picker.Item label="Highest Rated" value="reviews"/>
                  <Picker.Item label="Most Listings" value="listings"/>
                </Picker>
              </View>
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
          <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} style={{ marginLeft: "auto" }}/>
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
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 5 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  pickerContainer: {
    width: 200,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  
  headerIcon: {
    backgroundColor: "#607D8B",
    padding: 12,
    borderRadius: 15,
  },
  
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  
  orgRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
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
