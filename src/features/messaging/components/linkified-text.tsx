import { router } from "expo-router";
import React from "react";
import { Text, type TextStyle } from "react-native";

// Only matches in-app listing paths, so arbitrary text can't link anywhere else
const LISTING_PATH =
  /(\/reviewPage(?:\?listingId=[A-Za-z0-9_-]+)?|\/listing\/[A-Za-z0-9_-]+)/g;

export function LinkifiedText({
  body,
  style,
  linkStyle,
}: {
  body: string;
  style?: TextStyle | TextStyle[];
  linkStyle?: TextStyle;
}) {
  // split() with a capture group puts the matches at odd indices
  const parts = body.split(LISTING_PATH);

  return (
    <Text style={style}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text
            key={i}
            accessibilityRole="link"
            onPress={() => router.push(part as any)}
            style={[
              { textDecorationLine: "underline", fontWeight: "600" },
              linkStyle,
            ]}
          >
            View item
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
