import * as Device from "expo-device";
import React from "react";
import { Platform, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import ItemC from "@/Items/ItemCreation";
import { ListingList } from "@/Items/ItemDisplay";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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
  const itemList = useQuery(api.listings.list, {});
  return (
    <div>
      <ItemC />
      <ListingList />
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
