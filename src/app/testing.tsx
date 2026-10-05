import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ListingsTest from "./tests/listings";

type TestEntry = {
  id: string;
  title: string;
  component: React.ComponentType;
};

// Add a new entry here for each backend test screen.
const tests: TestEntry[] = [
  { id: "listings", title: "Listings test", component: ListingsTest },
];

export default function TestingScreen() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Backend Testing</Text>

      {tests.map(({ id, title, component: Test }) => {
        const isOpen = open[id] ?? false;
        return (
          <View key={id} style={styles.section}>
            <Pressable onPress={() => toggle(id)} style={styles.sectionHeader}>
              <Text style={styles.caret}>{isOpen ? "▾" : "▸"}</Text>
              <Text style={styles.sectionTitle}>{title}</Text>
            </Pressable>
            {isOpen && <Test />}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 24, fontWeight: "700" },
  section: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#f3f4f6",
  },
  caret: { width: 12, fontSize: 14, color: "#555" },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
});
