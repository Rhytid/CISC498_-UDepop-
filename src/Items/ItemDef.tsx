import type { TagType } from "@/Tag/TagDef";
export interface Item {
  Name: string;
  Price: number;
  Tags: TagType[];
  Description: string;
}

export interface ItemLists {
  Items: Item[];
}
