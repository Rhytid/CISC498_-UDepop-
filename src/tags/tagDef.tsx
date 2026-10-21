import React from "react";
import Select, { type StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";

export const TagList: string[] = [
  "freshman",
  "sophomore",
  "junior",
  "senior",
  "delivery",
  "drop-off",
  "pickup",
];

export type TagType = { value: string; label: string };

// Maps the original tag list to the dropdown options.
const tagOptions: TagType[] = TagList.map((t) => ({ value: t, label: t }));
const animatedComponents = makeAnimated();

// Opaque backgrounds so the menu doesn't show the page behind it, and a
// scrollable menu that shows about 5 options at a time.
const styles: StylesConfig<TagType, true> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    boxShadow: "none",
    "&:hover": { borderColor: "#999" },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#eef2ff"
      : state.isFocused
        ? "#f3f4f6"
        : "#fff",
    color: "#111",
    cursor: "pointer",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e0e7ff",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#3730a3",
  }),
};

type Props = {
  value: TagType[];
  onChange: (tags: TagType[]) => void;
};

export default function AnimatedMulti({ value, onChange }: Props) {
  return (
    <Select<TagType, true>
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      isSearchable
      options={tagOptions}
      value={value}
      onChange={(selected) => onChange([...selected])}
      placeholder="Search tags…"
      noOptionsMessage={() => "No tags found"}
      maxMenuHeight={190}
      styles={styles}
    />
  );
}
