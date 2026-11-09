import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function singleUserList() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useQuery(
    api.users.getPublicById,
    id && id !== "index" ? { userId: id as Id<"users">} : "skip"
  );
  const UserListings = useQuery(
    api.listings.listByUser,
    id ? { userId: id as Id<"users"> } : "skip",
  );
  if (UserListings === undefined) {
    return <Text>Loading...</Text>;
  }

  if (!id || id === "index") {
    return null; // Or a loading spinner while the index route mounts properly
  }
  if (user === undefined){
    return <Text style={{ color: "white" }}>Loading Profile...</Text>
  }
  if (user === null) {
    return <Text style={{ color: "white"}}>User does not exist</Text>
  }
  return (
    <ScrollView style={styles.scrollView}>
      <Pressable onPress={() => router.replace("/allusers")}>
        <Text style={{ color: "white", fontSize: 18}}>← Back to All Users</Text>
      </Pressable>
      <View style={styles.banner}>
        <Text style={[styles.bannerText, { color: "black" }]}>@{user.username}</Text>
        <Text>{user.firstname} {user.lastname}</Text>
        <Text>{user.bio}</Text>
        <Text>{user.location}</Text>
        <Text>{UserListings.length} listings</Text>
      </View>
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
