import type { Item } from "../Items/ItemDef";

export interface Account {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  myListings: Item[];
  favorites: Item[];

  friends: Account[]; // may be a problem for security reasons with passwords
}
