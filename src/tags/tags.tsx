import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export const TagList: string[] = [
  "freshman",
  "sophomore",
  "junior",
  "senior",
  "drop-off",
  "pickup",
  "furniture",
  "clothes",
  "decor",
  "class materials",
];

const tagOptions: TagType[] = TagList.map((t) => ({ id: t, value: t }));

export type TagType = { id: string; value: string };

interface tagProps {
  value: TagType[];
  onChange: (next: TagType[]) => void;
};

export function TagPicker({ value, onChange }: tagProps) {
  const [open, setOpen] = useState(false);

  const selectedIds = new Set(value.map((t) => t.id));

  const toggle = (tag: TagType) => {
    onChange(
      selectedIds.has(tag.id)
        ? value.filter((t) => t.id !== tag.id)
        : [...value, tag]
    );
  };

  return (
    <View>
      {/* control */}
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={({ pressed }) => [styles.control, pressed && styles.controlPressed]}
      >
        {value.length === 0 && <Text style={styles.placeholder}>Select tags…</Text>}
        {value.map((tag) => (
          <View key={tag.id} style={styles.multiValue}>
            <Text style={styles.multiValueLabel}>{tag.value}</Text>
            <Pressable onPress={() => toggle(tag)} hitSlop={8}>
              <Text style={styles.multiValueLabel}><Ionicons name="close"></Ionicons></Text>
            </Pressable>
          </View>
        ))}
      </Pressable>

      {/* menu */}
      {open && (
        <View style={styles.menu}>
          <FlatList
            data={tagOptions}
            keyExtractor={(item) => item.id}
            style={styles.menuList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <Pressable
                  onPress={() => toggle(item)}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                    isSelected && styles.optionSelected, // last = wins
                  ]}
                >
                  <Text style={styles.optionText}>{item.value}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: "row",
    flexWrap: "wrap",          // chips wrap to new lines
    alignItems: "center",
    minHeight: 38,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  controlPressed: { borderColor: "#999" },
  placeholder: { color: "#999" },

  menu: {
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 4,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  menuList: { maxHeight: 220, backgroundColor: "#fff" },

  option: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "#fff" },
  optionPressed: { backgroundColor: "#f3f4f6" },
  optionSelected: { backgroundColor: "#eef2ff" },
  optionText: { color: "#111" },

  multiValue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    borderRadius: 2,
    margin: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  multiValueLabel: { color: "#3730a3" },
});