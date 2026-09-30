import Select from "react-select";
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
var count = 0;
//Maps the original tag list to the dropdown menu

const tagOptions: TagType[] = TagList.map((t) => ({ value: t, label: t }));
const animatedComponents = makeAnimated();

type Props = {
  value: TagType[];
  onChange: (tags: TagType[]) => void;
};
//Default code pulled from the documentation website for React Select
export default function AnimatedMulti({ value, onChange }: Props) {
  return (
    <Select<TagType, true>
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={tagOptions}
      value={value}
      onChange={(selected) => onChange([...selected])}
    />
  );
}
