import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function singleUserList() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const UserListings = useQuery(
    api.listings.listByUser,
    id ? { userId: id as Id<"users"> } : "skip",
  );
  if (UserListings === undefined) {
    return <Text>Loading...</Text>;
  }

  if (UserListings.length === 0) {
    return <Text>No listings yet</Text>;
  }
  if (!id || id === "index") {
    return null; // Or a loading spinner while the index route mounts properly
  }
  return (
    <ScrollView contentContainerStyle={styles.itemContainer}>
      {UserListings.map((item) => (
        <View key={item._id} style={styles.itemContainer}>
          <Text>
            {item.title} - ${item.price}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  banner: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#ccc",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: 150,
    alignItems: "center",
  },
});
