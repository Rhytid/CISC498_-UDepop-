import { useQuery } from "convex/react";
import React, { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function ListingList() {
  const [search, setSearch] = useState("");

  const result = useQuery(api.listings.list, {
    searchText: search || undefined, // empty string would trigger the search branch
  });

  if (result === undefined) {
    return <Text>Loading...</Text>;
  }
  //Function to display the seller name
  function SellerName({ userId }: { userId: Id<"users"> }) {
    const user = useQuery(api.users.getById, { userId });

    if (user === undefined) return <Text>Seller: ...</Text>;
    if (user === null) return <Text>Seller: Unknown</Text>;
    return <Text>Seller: {user.username}</Text>;
  }
  return (
    <View style={{ padding: 20, flex: 1 }}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search listings..."
      />

      <FlatList
        data={result.page}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No listings found.</Text>}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>
              <SellerName userId={item.ownerId} />
            </Text>
            <Text>${item.price}</Text>
            <Text>{item.description}</Text>
            <Text>{item.tags.join(", ")}</Text>
          </View>
        )}
      />
    </View>
  );
}
