// Small shortcut button that navigates to the user's messages route.
// Can be embedded in marketplace UI as an entry point to the inbox.
import { router } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function OwnMessages() {
  return <Button title="My Messages" onPress={() => router.push("/messages")} />;
}