import { Ionicons } from "@expo/vector-icons";
import type { TabTriggerSlotProps } from "expo-router/ui";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { SIDEBAR_ACCENT, type SidebarItemDef } from "./navigation";

type SidebarItemProps = TabTriggerSlotProps & {
  item: SidebarItemDef;
  isOpen: boolean;
  badgeCount?: number;
};

export function SidebarItem({
  item,
  isOpen,
  badgeCount,
  isFocused,
  children: _children,
  style: _injectedStyle,
  href: _href,
  ...rest
}: SidebarItemProps) {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const active = Boolean(isFocused);
  const backgroundColor = active
    ? SIDEBAR_ACCENT
    : hovered
      ? theme.backgroundSelected
      : "transparent";
  const foreground = active
    ? "#FFFFFF"
    : hovered
      ? theme.text
      : theme.textSecondary;

  return (
    <Pressable
      {...rest}
      accessibilityRole="link"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.item,
        isOpen ? styles.itemExpanded : styles.itemCollapsed,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={active ? item.iconActive : item.icon}
        size={22}
        color={foreground}
      />

      {isOpen && (
        <>
          <Text numberOfLines={1} style={[styles.label, { color: foreground }]}>
            {item.label}
          </Text>
          {badgeCount != null && badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount > 99 ? "99+" : String(badgeCount)}
              </Text>
            </View>
          )}
        </>
      )}

      {!isOpen && badgeCount != null && badgeCount > 0 && (
        <View style={styles.dot} />
      )}

      {!isOpen && hovered && (
        <View
          pointerEvents="none"
          style={[styles.tooltip, { backgroundColor: theme.text }]}
        >
          <Text style={[styles.tooltipText, { color: theme.background }]}>
            {item.label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  itemExpanded: {
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemCollapsed: {
    justifyContent: "center",
    paddingVertical: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E53935",
  },
  tooltip: {
    position: "absolute",
    left: "100%",
    marginLeft: 12,
    top: "50%",
    transform: [{ translateY: -15 }],
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 1000,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
  tooltipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
