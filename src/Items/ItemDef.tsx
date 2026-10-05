import type { TagType } from "@/Tag/TagDef";
export interface Item {
  Name: string;
  Price: number;
  Tags: TagType[];
  Description: string;
}

/* Unneeded now that we're moving data straight to the cloud
export interface ItemLists {
  Items: Item[];
}*/
