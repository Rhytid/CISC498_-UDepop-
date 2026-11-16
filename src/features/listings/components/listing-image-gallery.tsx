import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";

const NO_IMAGE = require("@/assets/images/no-image.jpg");

export function ListingImageGallery({
  photos,
  photoUrls,
}: {
  photos: string[];
  photoUrls?: Record<string, string | null>;
}) {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const photo = photos[index];
  const uri = photo
    ? photo.startsWith("http")
      ? photo
      : photoUrls?.[photo]
    : null;
  const failed = uri !== undefined && uri !== null && failedUri === uri;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement },
      ]}
    >
      {uri === undefined ? (
        <ActivityIndicator color={theme.textSecondary} />
      ) : uri === null || failed ? (
        <>
          <Image
            source={NO_IMAGE}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            accessibilityLabel="No listing image available"
          />
          <Text style={[styles.noImageText, { color: theme.textSecondary }]}>
            Photo unavailable
          </Text>
        </>
      ) : (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityLabel={`Listing photo ${index + 1}`}
          onError={() => setFailedUri(uri)}
        />
      )}

      {photos.length > 1 && (
        <>
          {index > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous listing photo"
              onPress={() => setIndex((current) => current - 1)}
              style={[styles.arrow, styles.leftArrow]}
            >
              <Ionicons name="chevron-back" size={20} color={theme.text} />
            </Pressable>
          )}
          {index < photos.length - 1 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next listing photo"
              onPress={() => setIndex((current) => current + 1)}
              style={[styles.arrow, styles.rightArrow]}
            >
              <Ionicons name="chevron-forward" size={20} color={theme.text} />
            </Pressable>
          )}
          <View
            style={[
              styles.counter,
              { backgroundColor: theme.background, opacity: 0.9 },
            ]}
          >
            <Text style={[styles.counterText, { color: theme.text }]}>
              {index + 1} / {photos.length}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  noImageText: {
    position: "absolute",
    bottom: 12,
    fontSize: 12,
  },
  arrow: {
    position: "absolute",
    top: "45%",
    zIndex: 1,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(33,34,37,0.82)",
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  counter: {
    position: "absolute",
    right: 10,
    bottom: 10,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  counterText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
