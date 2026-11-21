/**
 * Central design tokens and platform-aware spacing used by the app's UI.
 * Shared theme hooks and screens consume these values for consistent light/dark styling.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#077B83",
    secondary: "#54DAE4",
    accent: "#E47E17",
    accentDark: "#D9624C",
    text: "#081716",
    textLight: "#E6F9F8",
    background: "#FAE9DD",
    backgroundElement: "#FAD2BC",
    textSecondary: "#4A5554",
    backgroundSelected: "#F5C0A3",
  },
  dark: {
    primary: "#4E1A6A",
    secondary: "#585C8D",
    accent: "#F6BB9D",
    accentDark: "#D94B3A",
    text: "#F5EDE8",
    textLight: "#E6F9F8",
    background: "#100D13",
    backgroundElement: "#2A211D",
    textSecondary: "#4A5554",
    backgroundSelected: "#F5C0A3",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
