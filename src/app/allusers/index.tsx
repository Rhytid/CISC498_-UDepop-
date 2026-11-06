import { usePaginatedQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text } from "react-native";
import { api } from "../../../convex/_generated/api";
export default function allusers() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.listAll,
    {},
    { initialNumItems: 20 },
  );
  const router = useRouter();
  return (
    <div>
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
            source={{ uri: pfp }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <Text>{username}</Text>
        </Pressable>
      ))}
      <Pressable
        onPress={() => loadMore(5)}
        disabled={status !== "CanLoadMore"}
      >
        <Text>Load More</Text>
      </Pressable>
    </div>
  );
}
