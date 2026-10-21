import * as Device from "expo-device";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import ItemCard from "@/Items/itemCard";
import ItemC from "@/Items/ItemCreation";
import { ListingList } from "@/Items/ItemDisplay";
import { useQuery } from "convex/react";
import { Text } from "expo-router/build/react-navigation";
import { api } from "../../convex/_generated/api";
import OwnMessages from "./UserMessaging/OwnMessages";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const [search, setSearch] = React.useState("");

  const result = useQuery(api.listings.list, {
    searchText: search || undefined, // empty string would trigger the search branch
  });
  if (result === undefined) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.container}>
      <ItemC />
      <Text style={styles.bannerText}>Products:</Text>
      <View style={styles.itemContainer}>
        {result.page.map((item) => (
          <ItemCard key={item._id} listing={item} />
        ))}
      </View>
      <OwnMessages />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
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
});
