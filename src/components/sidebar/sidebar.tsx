import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";
import { SidebarFooter } from "./sidebar-footer";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  sidebarWidth: SharedValue<number>;
  children: React.ReactNode;
};

export function Sidebar({
  isOpen,
  onToggle,
  sidebarWidth,
  children,
  ...rest
}: SidebarProps) {
  const theme = useTheme();
  const widthStyle = useAnimatedStyle(() => ({ width: sidebarWidth.value }));

  return (
    <Animated.View
      {...rest}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement },
        widthStyle,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.logoRow,
            { justifyContent: isOpen ? "space-between" : "center" },
          ]}
        >
          <Pressable
            onPress={isOpen ? undefined : onToggle}
            accessibilityRole="button"
            accessibilityLabel="UDepop"
          >
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logoImage}
            />
          </Pressable>
          {isOpen && (
            <Text style={[styles.logoText, { color: theme.text }]}>UDepop</Text>
          )}
          {isOpen && (
            <Pressable
              onPress={onToggle}
              accessibilityRole="button"
              accessibilityLabel="Collapse sidebar"
              style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={theme.textSecondary}
              />
            </Pressable>
          )}
        </View>
        {!isOpen && (
          <Pressable
            onPress={onToggle}
            accessibilityRole="button"
            accessibilityLabel="Expand sidebar"
            style={({ pressed }) => [
              styles.toggle,
              styles.toggleCollapsed,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.textSecondary}
            />
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={() => router.push("/")}
        accessibilityRole="search"
        accessibilityLabel="Search listings"
        style={({ pressed }) => [
          styles.search,
          { backgroundColor: theme.backgroundSelected },
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="search" size={18} color={theme.textSecondary} />
        {isOpen && (
          <Text style={[styles.searchText, { color: theme.textSecondary }]}>
            Search
          </Text>
        )}
      </Pressable>

      <ScrollView
        style={styles.nav}
        contentContainerStyle={styles.navContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <SidebarFooter isOpen={isOpen} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: "column",
    paddingVertical: 16,
    paddingHorizontal: 12,
    zIndex: 100,
  },
  header: {
    alignItems: "stretch",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 40,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  logoText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  toggle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleCollapsed: {
    alignSelf: "center",
    marginTop: 8,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchText: {
    fontSize: 14,
    fontWeight: "500",
  },
  nav: {
    flex: 1,
    minHeight: 0,
    marginBottom: 8,
  },
  navContent: {
    paddingTop: 6,
    gap: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
