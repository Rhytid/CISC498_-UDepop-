import MessageButton from "@/app/UserMessaging/CallingMessagePopup";
import { useQuery } from "convex/react";
import {
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from "convex/server";
import React, { useRef, useState } from "react";
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

  //Makes the Search continuous
  function useStableQuery<Query extends FunctionReference<"query">>(
    query: Query,
    ...args: OptionalRestArgs<Query>
  ): FunctionReturnType<Query> | undefined {
    const result = useQuery(query, ...args);
    const stored = useRef<FunctionReturnType<Query> | undefined>(result);

    // Only update once the new result has actually loaded
    if (result !== undefined) {
      stored.current = result;
    }
    return stored.current;
  }
  // Pulls the userId from the item and then searches in the directory for the User
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
            <MessageButton listingId={item._id} />
          </View>
        )}
      />
    </View>
  );
}
