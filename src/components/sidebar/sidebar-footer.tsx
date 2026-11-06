import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useQuery } from "convex/react";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { api } from "../../../convex/_generated/api";

const DEFAULT_AVATAR = require("@/assets/images/default-profile-picture.png");

export function SidebarFooter({ isOpen }: { isOpen: boolean }) {
  const theme = useTheme();
  const me = useQuery(api.users.getMe);
  const { signOut } = useAuthActions();

  const name = me
    ? `${me.firstName} ${me.lastName}`.trim() || me.username
    : "";
  const school = me?.location?.trim() || me?.email || "";
  const avatarSource =
    me?.profilePicture && me.profilePicture.startsWith("http")
      ? { uri: me.profilePicture }
      : DEFAULT_AVATAR;

  if (!isOpen) {
    return (
      <View
        style={[
          styles.footer,
          styles.footerCollapsed,
          { borderTopColor: theme.backgroundSelected },
        ]}
      >
        <Link href="/profile" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="View profile"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Image source={avatarSource} style={styles.avatarCollapsed} />
          </Pressable>
        </Link>
        <Pressable
          onPress={() => signOut()}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.footer, { borderTopColor: theme.backgroundSelected }]}>
      <Link href="/profile" asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="View profile"
          style={({ pressed }) => [styles.userRow, pressed && styles.pressed]}
        >
          <Image source={avatarSource} style={styles.avatar} />
          <View style={styles.userMeta}>
            <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
              {name || "UDepop member"}
            </Text>
            {school !== "" && (
              <Text
                numberOfLines={1}
                style={[styles.school, { color: theme.textSecondary }]}
              >
                {school}
              </Text>
            )}
          </View>
        </Pressable>
      </Link>
      <Pressable
        onPress={() => signOut()}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color={theme.textSecondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  footerCollapsed: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
  },
  userRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  userMeta: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
  },
  school: {
    fontSize: 12,
    marginTop: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
  },
  avatarCollapsed: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
  },
  signOut: {
    padding: 6,
  },
  pressed: {
    opacity: 0.7,
  },
});
