import React from "react";
import { Image } from "react-native";

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
    <Image
      source={source}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="cover"
    />
  );
}
