import type { TagType } from "@/tags/tagDef";
import AnimatedMulti from "@/tags/tagDef";
import React, { useState } from "react";
import type { Item, ItemLists } from "@/Items/itemDef";

const tempListing: ItemLists = {
  items: [],
};
const tempItem: Item = {
  name: "test",
  tags: [],
  price: 42,
  description: "This is an item",
  image: ""
};

export function ItemD() {
  //Initialize the state to hold the textbox value
  const [Name, setName] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [Tags, setTags] = useState<TagType[]>([]);
  const [Description, setDescription] = useState<string>("");
  const [ItemListing, setItemListing] = useState<ItemLists>({ items: [] });

  // Updates the State whenever the user types
  const nameSet = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(event.target.value);
  };
  const priceSet = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPrice(Number(event.target.value));
  };

  const descriptionSet = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDescription(event.target.value);
  };
  const ItemListingSet = () => {
    setItemListing({ items: [tempItem] });
  };

  function AddItem() {
    const NewItem: Item = {
      name: Name, price: Price, tags: Tags, description: Description,
      image: ""
    };
    setItemListing((prev) => ({ items: [...prev.items, NewItem] }));
    setTags([]);
  }

  return (
    <div style={{ padding: "20px" }}>
      <label htmlFor="username">Enter Name: </label>
      <input
        id="name"
        type="text"
        value={Name}
        onChange={nameSet}
        placeholder="Type something..."
      />
      <input
        id="price"
        type="text"
        value={Price}
        onChange={priceSet}
        placeholder="Type something..."
      />
      <AnimatedMulti value={Tags} onChange={setTags} />

      <input
        id="description"
        type="text"
        value={Description}
        onChange={descriptionSet}
        placeholder="Type something..."
      />
      <button
        onClick={AddItem}
        style={{ backgroundColor: "#841584", color: "white" }}
      >
        Add Item
      </button>

      <ul>
        {ItemListing.items.map((item, i) => (
          <li key={i}>
            {item.name} — ${item.price} — {item.description}
            {item.tags.length > 0 && (
              <> — [{item.tags.map((t) => t.label).join(", ")}]</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ItemD;
