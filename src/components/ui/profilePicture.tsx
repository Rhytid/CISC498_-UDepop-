import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";

export default function ProfilePicture() {
  const [picture, setPicture] = useState<string | null>(null);

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
    <View>
      <TouchableOpacity onPress={pickImage}>
        {picture ? (
          <Image source={{ uri: picture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Text>Pick Image</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
