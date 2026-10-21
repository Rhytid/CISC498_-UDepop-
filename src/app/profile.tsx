import ProfilePicture from "@/components/ui/profilePicture";
import ItemCard from "@/Items/itemCard";
import itemData from "../data/itemData.json";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useListingActions } from "@/Items/listingActions";

export default function ProfileScreen() {
  const { deleteListing } = useListingActions();
  const [search, setSearch] = React.useState("");
  const result = useQuery(api.listings.list, {
      searchText: search || undefined, // empty string would trigger the search branch
  });
  if (result === undefined) {
      return <Text>Loading...</Text>;
  }


  return (
    <ScrollView>
      <View style={styles.banner}>
        <ProfilePicture />
        <Text style={styles.bannerText}>
          @username <Ionicons name="star" size={25} color="gold" /> 5.0
        </Text>
        <Text>3 Products | 50 Followers</Text>
      </View>
      <Text style={styles.bannerText}>Products:</Text>
      <View style={styles.itemContainer}>
        {result.page.map((item) => (
          <ItemCard key={item._id} listing={item} currentUserId={item.ownerId} onDeleteListing={deleteListing}/>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
