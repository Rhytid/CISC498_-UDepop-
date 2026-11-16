import { useQuery } from "convex/react";
import type { Href } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React, { Fragment, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  navigationSections,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
} from "@/shared/components/sidebar/navigation";
import { Sidebar } from "@/shared/components/sidebar/sidebar";
import { SidebarItem } from "@/shared/components/sidebar/sidebar-item";
import { SidebarSectionTitle } from "@/shared/components/sidebar/sidebar-section";
import { api } from "@convex/_generated/api";

export default function AppTabs() {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarWidth = useSharedValue(SIDEBAR_EXPANDED_WIDTH);

  const conversations = useQuery(api.conversations.list);
  const unreadNotifications = useQuery(api.notifications.unreadCount);

  const badgeCounts: Record<string, number> = {
    messages: conversations
      ? conversations.reduce((sum, c) => sum + c.unreadCount, 0)
      : 0,
    notifications: unreadNotifications ?? 0,
  };

  const toggle = () => {
    const target = isOpen ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;
    setIsOpen(!isOpen);
    sidebarWidth.value = withTiming(target, {
      duration: 220,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const contentStyle = useAnimatedStyle(() => ({
    paddingLeft: sidebarWidth.value,
  }));

  return (
    <Tabs>
      <Animated.View style={[styles.content, contentStyle]}>
        <TabSlot style={styles.slot} />
      </Animated.View>

      <TabList asChild>
        <Sidebar isOpen={isOpen} onToggle={toggle} sidebarWidth={sidebarWidth}>
          {/* NOTE: expo-router's headless Tabs only discovers <TabTrigger>
              children through <Fragment> (or <TabList>). Keep triggers in
              flat fragments so they stay registered with the router. */}
          {navigationSections.map((section) => (
            <Fragment key={section.id}>
              <SidebarSectionTitle
                title={section.title ?? ""}
                isOpen={isOpen}
              />
              {section.items.map((item) => (
                <TabTrigger
                  key={item.id}
                  name={item.id}
                  href={item.href as Href}
                  asChild
                >
                  <SidebarItem
                    item={item}
                    isOpen={isOpen}
                    badgeCount={
                      item.badgeKey ? badgeCounts[item.badgeKey] : undefined
                    }
                  />
                </TabTrigger>
              ))}
            </Fragment>
          ))}
          {/* Register standalone sub-screens as tabs so they render in
              <TabSlot /> alongside the sidebar, without showing them as nav items. */}
          <Fragment>
            <TabTrigger
              name="a-user"
              href="/a-user"
              style={styles.hiddenTrigger}
            />
            <TabTrigger
              name="listing-editor"
              href="/listing-editor"
              style={styles.hiddenTrigger}
            />
          </Fragment>
        </Sidebar>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    height: "100%",
  },
  slot: {
    flex: 1,
    height: "100%",
  },
  hiddenTrigger: {
    display: "none",
  },
});
