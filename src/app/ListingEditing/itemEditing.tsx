// Edit this to edit how the edit button looks and what it calls
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { Id } from "../../../convex/_generated/dataModel";

export default function EditListingButton({
  listingId,
}: {
  listingId: Id<"listings">;
}) {
  const popupRef = useRef<Window | null>(null);

  if (Platform.OS !== "web") return null;

  const onPress = () => {
    const url = `/ListingEditing/editingPopup?listingId=${listingId}`;

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.location.href = url;
      popupRef.current.focus();
      return;
    }

    const w = 450,
      h = 600;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    popupRef.current = window.open(
      url,
      "EditListingPopup",
      `width=${w},height=${h},left=${left},top=${top}`,
    );
  };

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Ionicons name="create-outline" size={40} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  cardWrapper: {
    alignSelf: "flex-start",
    borderRadius: 20,
  },
  card: {
    width: 300,
    height: 300,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    margin: 10,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
