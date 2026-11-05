import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

/**
 * Single source of truth for the sidebar navigation.
 *
 * To add a new sidebar item:
 *   1. Create the page/route under src/app (e.g. src/app/notifications.tsx).
 *   2. Add one object to the section of your choice below.
 *
 * Nothing else needs to change — the sidebar renders items straight from
 * this configuration.
 */

export type SidebarIconName = ComponentProps<typeof Ionicons>["name"];

/** Badges that are wired to real data in the sidebar. */
export type SidebarBadgeKey = "messages" | "notifications";

export type SidebarItemDef = {
  id: string;
  label: string;
  href: string;
  icon: SidebarIconName;
  iconActive: SidebarIconName;
  badgeKey?: SidebarBadgeKey;
};

export type SidebarSectionDef = {
  id: string;
  title?: string;
  items: SidebarItemDef[];
};

export const SIDEBAR_EXPANDED_WIDTH = 248;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

/** Existing UDepop blue-gray accent, shared with the home banners/buttons. */
export const SIDEBAR_ACCENT = "#607D8B";

export const navigationSections: SidebarSectionDef[] = [
  {
    id: "menu",
    title: "Menu",
    items: [
      {
        id: "home",
        label: "Home",
        href: "/",
        icon: "home-outline",
        iconActive: "home",
      },
      {
        id: "allusers",
        label: "All Users",
        href: "/allusers",
        icon: "people-outline",
        iconActive: "people",
      },
      {
        id: "profile",
        label: "Profile",
        href: "/profile",
        icon: "person-outline",
        iconActive: "person",
      },
    ],
  },
  {
    id: "marketplace",
    title: "Marketplace",
    items: [
      {
        id: "messages",
        label: "Messages",
        href: "/messages",
        icon: "chatbubble-outline",
        iconActive: "chatbubble",
        badgeKey: "messages",
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/notifications",
        icon: "notifications-outline",
        iconActive: "notifications",
        badgeKey: "notifications",
      },
      {
        id: "bookmarks",
        label: "Bookmarks",
        href: "/bookmarks",
        icon: "bookmark-outline",
        iconActive: "bookmark",
      },
    ],
  },
  {
    id: "general",
    title: "General",
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: "settings-outline",
        iconActive: "settings",
      },
      {
        id: "testing",
        label: "Testing",
        href: "/testing",
        icon: "flask-outline",
        iconActive: "flask",
      },
    ],
  },
];
