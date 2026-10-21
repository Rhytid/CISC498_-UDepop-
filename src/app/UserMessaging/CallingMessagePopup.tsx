import { useMutation } from "convex/react";
import React, { useRef } from "react";
import { Button, Platform } from "react-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function MessageButton({
  listingId,
}: {
  listingId: Id<"listings">;
}) {
  const startConvo = useMutation(api.conversations.startItemConvo);
  const popupRef = useRef<Window | null>(null);

  if (Platform.OS !== "web") return null;

  const onPress = async () => {
    if (!listingId) {
      console.warn("MessageButton: missing listingId");
      return;
    }
    if (!popupRef.current || popupRef.current.closed) {
      const w = 400,
        h = 500;
      const left = window.screen.availWidth - w;
      const top = window.screen.availHeight - h;
      popupRef.current = window.open(
        "about:blank",
        "MyPopup",
        `width=${w},height=${h},left=${left},top=${top}`,
      );
    }
    const popup = popupRef.current;
    if (!popup) return; // blocked

    popup.document.body.innerText = "Loading...";
    try {
      const conversationId = await startConvo({ listingId });
      popup.location.href = `/UserMessaging/MessagePopup?conversationId=${conversationId}`;
      popup.focus();
    } catch (e) {
      popup.document.body.innerText = (e as Error).message;
      console.warn((e as Error).message);
    }
  };

  return <Button title="Message Seller" onPress={onPress} />;
}
