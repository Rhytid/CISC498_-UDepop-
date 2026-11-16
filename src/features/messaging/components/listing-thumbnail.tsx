import React from "react";
import { Image, StyleSheet, View } from "react-native";

const NO_IMAGE = require("@/assets/images/no-image.jpg");

export function ListingThumbnail({
  photos,
  photoUrls,
  size = 64,
}: {
  photos?: string[];
  photoUrls?: Record<string, string | null>;
  size?: number;
}) {
  const photo = photos?.[0];
  const uri = photo
    ? photo.startsWith("http")
      ? photo
      : (photoUrls?.[photo] ?? null)
    : null;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: Math.max(8, size * 0.14) },
      ]}
    >
      <Image
        source={uri ? { uri } : NO_IMAGE}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#E0E1E6",
  },
});
