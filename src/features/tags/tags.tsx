import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Tag labels available in the picker. Each label is also used as the tag ID.
 */
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
  "electronics",
  "kitchen",
  "enterainment"
];

// Convert the public label list to the shape consumed by TagPicker.
const tagOptions: TagType[] = TagList.map((t) => ({ id: t, value: t }));

/** A tag's stable identifier and user-visible label. */
export type TagType = { id: string; value: string };

/**
 * Props for TagPicker. The selected values are controlled by the parent.
 * `onChange` receives the complete updated selection after a tag is toggled.
 */
interface tagProps {
  value: TagType[];
  onChange: (next: TagType[]) => void;
};

/**
 * Displays selected tags as removable chips and an expandable list of choices.
 *
 * Selection is controlled by `value` and `onChange`; only whether the choices
 * menu is open is managed internally. Tapping an option toggles it in the
 * selection, and tapping a chip's close icon removes it.
 *
 * Implementation note: most of this component was generated with Claude
 * Sonnet 5.5.
 */
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