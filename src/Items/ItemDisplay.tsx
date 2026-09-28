import React, { useState } from "react";
import type { Item, ItemLists } from "./ItemDef";

const tempListing: ItemLists = {
  Items: [],
};
const tempItem: Item = {
  Name: "test",
  Tags: [],
  Price: 42,
  Description: "This is an item",
};

export function ItemD() {
  //Initialize the state to hold the textbox value
  const [Name, setName] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [Tags, setTags] = useState<string[]>([]);
  const [Description, setDescription] = useState<string>("");
  const [ItemListing, setItemListing] = useState<ItemLists>({ Items: [] });

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
  /*const tagsSet = (event: {
    //Eventually thisll be a dropdown of a premade tag list
    target: { value: React.SetStateAction<string> };
  }) => {
    setTags(event.target.value);
  };*/
  const descriptionSet = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDescription(event.target.value);
  };
  const ItemListingSet = () => {
    setItemListing({ Items: [tempItem] });
  };

  function AddItem() {
    const NewItem: Item = {
      Name: Name,
      Price: Price,
      Tags: Tags,
      Description: Description,
    };
    setItemListing((prev) => ({ Items: [...prev.Items, NewItem] }));
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
      {/*<input
        id="tags"
        type="text"
        value={Tags}
        onChange={tagsSet}
        placeholder="Type something..."
      />*/}
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
        {ItemListing.Items.map((item, i) => (
          <li key={i}>
            {item.Name} — ${item.Price} — {item.Description}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ItemD;
