import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfilePicture() {
  /**
   *  Styles for the fade overlay that appears on hover
   *  taken from google search "how to add text to an
   *  image when hover in react native".
   *
   *  See below:
   *
   */
  const [picture, setPicture] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.shadow}>
      <Pressable
        onPress={pickImage}
        style={styles.imageWrapper}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        {picture ? (
          <View>
            <Image
              source={{ uri: picture }}
              style={styles.profilePicture}
              alt="Profile Picture"
            />
            {hovered && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>Click to Edit</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Image
              source={require("../../../assets/images/default-profile-picture.png")}
              style={styles.defaultProfilePicture}
              alt="Default Profile Picture"
            />
            {hovered && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>Click to Edit</Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    // x-offset, y-offset, blur-radius, color
    boxShadow: "0px 6px 6px rgba(0, 0, 0, 0.3)",
    borderRadius: 50,
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfilePicture: {
    width: 150,
    height: 150,
    borderRadius: 50,
    backgroundColor: "#5f5f5f",
  },
  overlay: {
    ...StyleSheet.absoluteFill, // Shortcuts top/bottom/left/right to 0
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#ffffff",
    fontSize: 15,
  },
});
