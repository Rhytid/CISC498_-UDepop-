export interface Item {
  Name: string;
  Price: number;
  Tags: string[];
  Description: string;
}

export interface ItemLists {
  Items: Item[];
}
