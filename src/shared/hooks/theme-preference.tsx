import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";

import { useColorScheme } from "@/shared/hooks/use-color-scheme";

export type ThemePreference = "light" | "dark";

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemePreferenceContext = createContext<
  ThemePreferenceContextValue | undefined
>(undefined);

const STORAGE_KEY = "udepop-theme";

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark";
}

function readWebPreference(): ThemePreference | null {
  if (Platform.OS !== "web") {
    return null;
  }
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isThemePreference(value) ? value : null;
  } catch {
    return null;
  }
}

function persistPreference(preference: ThemePreference) {
  if (Platform.OS === "web") {
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore storage failures
    }
    return;
  }
  SecureStore.setItemAsync(STORAGE_KEY, preference).catch(() => {});
}

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();
  const systemPreference: ThemePreference =
    systemScheme === "dark" ? "dark" : "light";

  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => readWebPreference() ?? systemPreference,
  );
  const [hasExplicitChoice, setHasExplicitChoice] = useState<boolean>(
    () => readWebPreference() !== null,
  );

  // Load the persisted value on native once the provider mounts.
  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((value) => {
        if (isThemePreference(value)) {
          setPreferenceState(value);
          setHasExplicitChoice(true);
        }
      })
      .catch(() => {});
  }, []);

  // Follow the system scheme until the user makes an explicit choice.
  // This also corrects the hydration-safe `useColorScheme` initial value on web.
  useEffect(() => {
    if (!hasExplicitChoice) {
      setPreferenceState(systemPreference);
    }
  }, [hasExplicitChoice, systemPreference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    setHasExplicitChoice(true);
    persistPreference(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = preference === "dark" ? "light" : "dark";
    setPreferenceState(next);
    setHasExplicitChoice(true);
    persistPreference(next);
  }, [preference]);

  const value = useMemo(
    () => ({ preference, setPreference, toggleTheme }),
    [preference, setPreference, toggleTheme],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const context = useContext(ThemePreferenceContext);
  if (context === undefined) {
    throw new Error(
      "useThemePreference must be used within a ThemePreferenceProvider",
    );
  }
  return context;
}
