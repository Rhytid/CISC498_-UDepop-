import ProfilePicture from "@/components/ui/profilePicture";
import { MaxContentWidth } from "@/constants/theme";
import ItemCard from "@/Items/itemCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView>
      <View style={styles.banner}>
        <ProfilePicture />
        <Text style={styles.bannerText}>
          @username <Ionicons name="star" size={25} color="gold" /> 5.0
        </Text>
        <Text>3 Products | 50 Followers</Text>
      </View>
      <Text>Products:</Text>
      <Text>Items go here</Text>
      <View style={styles.itemContainer}>
        <ItemCard/>
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
    justifyContent: "center",
  },
});
