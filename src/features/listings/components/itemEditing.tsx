// Owner-only listing edit affordance that navigates to the listing editor route.
// Listing cards use it to connect a displayed listing to its edit flow.
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Id } from "@convex/_generated/dataModel";

export default function EditListingButton({
  listingId,
}: {
  listingId: Id<"listings">;
}) {
  const onPress = () => {
    router.push({
      pathname: "/listing-editor",
      params: { listingId },
    });
  };

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Ionicons name="create-outline" size={40} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    borderRadius: 10,
  },
});