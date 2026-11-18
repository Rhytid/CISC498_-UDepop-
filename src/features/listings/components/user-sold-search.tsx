import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

//Lowkey Deprecated I gotta fix this sometime -Alex
export default function UserSoldSearchBox() {
  const [text, setText] = useState("");
  const term = text.trim();
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const results = useQuery(
    api.users.search,
    term ? { query: term, limit: 30 } : "skip",
  );

  return (
    <>
      <TextInput
        style={styles.username}
        value={text}
        onChangeText={setText}
        placeholder="Search users"
        autoCapitalize="none"
      />
      {term !== "" &&
        results?.map((user) => (
          <Pressable
            key={user._id}
            onPress={
              () =>
                router.push({
                  pathname: "/(tabs)",
                  params: { id: user._id, listingId },
                }) //Needs to also send a message to the user
            }
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.username}>{user.username}</Text>
          </Pressable>
        ))}
    </>
  );
}
const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { padding: 16, gap: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#cccccc",
  },
  username: { fontSize: 16, fontWeight: "600" },
  loadMore: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  pressed: { opacity: 0.7 },
});
