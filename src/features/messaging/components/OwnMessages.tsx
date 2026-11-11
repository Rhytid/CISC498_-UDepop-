import { router } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function OwnMessages() {
  return <Button title="My Messages" onPress={() => router.push("/messages")} />;
}