import { Picker } from "@react-native-picker/picker";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View, useColorScheme } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function allusers() {
  const [sortBy, setSortBy] = useState<"username" | "reviews" | "listings">("username");
  const [search, setSearch] = useState("");
  
  const searchedUsers = useQuery( api.users.search, search.trim() ? { query: search.trim() } : "skip");
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.listAll,
    { sortBy },
    { initialNumItems: 20 },
  );
  const usersShown = search.trim() ? searchedUsers?.map(( user ) => ({
    _id: user._id,
    username: user.username,
    pfp: user.profilePicture,
    firstName: user.firstName,
    lastName: user.lastName,
  })) ?? [] : results;
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <TextInput
      placeholder="Search users..."
      value={search}
      onChangeText={setSearch}
      placeholderTextColor='black'
      style={{
        backgroundColor: "white",
        color: "black",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
      }}
      >
      </TextInput>
      <View style={{ width: 200, marginBottom: 20 }}>
        <Picker selectedValue={sortBy} onValueChange={(value) => setSortBy(value)}>
          <Picker.Item label="Username (A-Z)" value="username"></Picker.Item>
          <Picker.Item label="Highest Rated" value="reviews"></Picker.Item>
          <Picker.Item label="Most Listings" value="listings"></Picker.Item>
        </Picker>
      </View>
      {usersShown.map(({ _id, username, pfp, firstName, lastName }) => (
        <Pressable
          key={_id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
            padding: 15,
            marginBottom: 10,
            borderRadius: 12,
            backgroundColor: colorScheme === 'dark' ? '#263238' : 'white',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#455A64' : 'light gray',
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
          <View>
            <Text style={{
              color: colorScheme === 'dark' ? 'white' : 'black',
              fontSize: 17,
              fontWeight: 'bold',
            }}>
              {firstName} {lastName}
            </Text>
            <Text style={{ 
              color: colorScheme === 'dark' ? '#B0BEC5' : '#607D8B', 
              fontSize: 13,
              marginTop: 3, 
            }}>
              @{username}
            </Text>
          </View>
        </Pressable>
      ))}
      {!search.trim() && (
        <Pressable
          onPress={() => loadMore(5)}
          disabled={status !== "CanLoadMore"}
        >
          <Text>Load More</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
