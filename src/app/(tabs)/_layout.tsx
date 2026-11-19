// Groups the main marketplace destinations under the app's tab navigator.
// The shared component selects native tabs or the web sidebar implementation.
import React from "react";

import AppTabs from "@/shared/components/app-tabs";

export default function TabsLayout() {
  return <AppTabs />;
}