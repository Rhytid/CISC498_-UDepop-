import { usePaginatedQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, useColorScheme } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function allusers() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.listAll,
    {},
    { initialNumItems: 20 },
  );
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {results?.map(({ _id, username, pfp }) => (
        <Pressable
          key={_id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 8,
          }}
          onPress={() => {
            console.log("pressed", _id);
            router.push({ pathname: "/allusers/[id]", params: { id: _id } });
          }}
        >
          <Image
            source={ pfp ? { uri: pfp } : require("@/assets/images/default-profile-picture.png")}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}>{username}</Text>
        </Pressable>
      ))}
      <Pressable
        onPress={() => loadMore(5)}
        disabled={status !== "CanLoadMore"}
      >
        <Text>Load More</Text>
      </Pressable>
    </ScrollView>
  );
}
