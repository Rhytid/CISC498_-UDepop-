import ProfilePicture from "@/components/ui/profilePicture";
import { MaxContentWidth } from "@/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import React from "react";

export default function ProfileScreen() {

  return (
    <ScrollView>
      <View style={styles.banner}>
        <ProfilePicture/>
        <Text style={styles.bannerText}>@username <Ionicons name="star" size={20} color="gold" /></Text>
      </View>
      <Text>Profile Display</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
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
});
