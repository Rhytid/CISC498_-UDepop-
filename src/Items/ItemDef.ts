import type { TagType } from "@/Tag/TagDef";
export interface Item {
  name: string;
  price: number;
  tags: TagType[];
  description: string;
  image: string;
}

export interface ItemLists {
  items: Item[];
}
