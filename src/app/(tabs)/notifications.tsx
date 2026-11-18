// Expo Router destination reserved for marketplace notifications.
// Shows a shared placeholder until the notification experience is implemented.
import { PlaceholderScreen } from "@/shared/ui/placeholder-screen";
import React from "react";

export default function NotificationsScreen() {
  return (
    <PlaceholderScreen
      title="Notifications"
      message="Notification Center Coming Soon"
      icon="notifications-outline"
    />
  );
}
