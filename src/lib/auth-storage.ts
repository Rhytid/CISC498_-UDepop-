import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { TokenStorage } from "@convex-dev/auth/react";

// Convex Auth needs somewhere to persist its session tokens. On native we use
// the encrypted SecureStore; on web we fall back to localStorage.
export const authStorage: TokenStorage =
  Platform.OS === "web"
    ? {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => {
          localStorage.setItem(key, value);
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      }
    : {
        getItem: (key) => SecureStore.getItemAsync(key),
        setItem: (key, value) => SecureStore.setItemAsync(key, value),
        removeItem: (key) => SecureStore.deleteItemAsync(key),
      };
