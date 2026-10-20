import React, { useRef } from "react";
import { Platform, Pressable, Text } from "react-native";

export default function OwnMessages() {
  const popupRef = useRef<Window | null>(null);

  if (Platform.OS !== "web") return null;

  const onPress = () => {
    const url = "/UserMessaging/ConversationsPopup";

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.location.href = url;
      popupRef.current.focus();
      return;
    }

    const w = 400,
      h = 500;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    popupRef.current = window.open(
      url,
      "MyPopup",
      `width=${w},height=${h},left=${left},top=${top}`,
    );
  };

  return (
    <Pressable onPress={onPress}>
      <Text style={{ color: "blue" }}>My messages</Text>
    </Pressable>
  );
}
