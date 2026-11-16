/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
	light: {
		primary: "#D73220",
		secondary: "#68150A",
		accent: "#0B78B3",
		accentDark: "#090C48",
		text: "#333333",
		textSecondary: "#765F56",
		textContrast: "#F5EDE8",
		background: "#F9ECE5",
		backgroundElement: "#dbc2b5",
		backgroundSelected: "#E8CFC0",
	},
	dark: {
		primary: "#69BDEB",
		secondary: "#B7B9FF",
		background: "#181311",
		text: "#F5EDE8",
		accent: "#FF8A78",
		accentDark: "#D94B3A",
		backgroundElement: "#2A211D",
		backgroundSelected: "#3D302A",
		textSecondary: "#C2B2A9",
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
