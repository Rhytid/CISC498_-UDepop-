import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

// Small shared pieces for the interactive backend test screens in
// src/app/tests/. Kept out of the app/ directory so they are never routes.

export function AuthNote() {
  return (
    <Text style={styles.authNote}>
      Authenticated actions use the signed-in account. Sign up from the sign-in
      screen to test the full flow (create listings, save, message, review).
    </Text>
  );
}

export function Section({ children }: { children: React.ReactNode }) {
  return <Text style={styles.section}>{children}</Text>;
}

export function Field({
  label,
  ...inputProps
}: { label: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#999"
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

export function Button({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function Result({ value }: { value: string }) {
  if (value === "") {
    return null;
  }
  return <Text style={styles.result}>{value}</Text>;
}

const styles = StyleSheet.create({
  authNote: {
    fontSize: 12,
    color: "#92400e",
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 10,
    lineHeight: 16,
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  field: { gap: 4 },
  label: { fontSize: 12, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#111",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  result: {
    fontFamily: "monospace",
    fontSize: 12,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
});
