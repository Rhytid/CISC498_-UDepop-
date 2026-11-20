// Small profile image with a default avatar for missing or invalid URLs.
// Used in conversation and chat UI to identify marketplace participants.
import React from "react";
import { Image, View } from "react-native";

const DEFAULT_AVATAR = require("@/assets/images/default-profile-picture.png");

export function Avatar({
  uri,
  size = 44,
}: {
  uri?: string | null;
  size?: number;
}) {
  const source =
    uri && (uri.startsWith("http://") || uri.startsWith("https://"))
      ? { uri }
      : DEFAULT_AVATAR;

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Image
        source={source}
        style={{ width: size + 12, height: size + 12 }}
        resizeMode="cover"
      />
    </View>
  );
}
